import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import IStartup from '../../../../src/core/domain/IStartup';
import ApplicationBuilder from '../../../../src/core/infrastructure/ApplicationBuilder';
import TYPES from '../../../../src/TYPES';
import Application from '../../../../src/core/infrastructure/Application';

import container from '../../../../src/core/infrastructure/di/DependencyContainer';
jest.mock('../../../../src/core/infrastructure/di/DependencyContainer', () => new Container());

describe('ApplicationBuilder', () => {
    let appBuilder: ApplicationBuilder;

    beforeEach(() => {
        jest.clearAllMocks();
        container.snapshot();
        appBuilder = new ApplicationBuilder();
    });

    afterEach(() => {
        container.restore();
    });

    describe('setStartup', () => {
        it('should display a warning message when setStartUp is called twice or more', () => {
            class MockStartup implements IStartup { async configureServices(){} async registerServices() {} }

            console.warn = jest.fn();
            appBuilder.setStartUp(MockStartup)
                      .setStartUp(MockStartup);

            expect(console.warn).toHaveBeenCalledTimes(1);
        });
    });

    describe('build', () => {
        it('should throw an error if no Core.IStartup is bound', async () => {
            await expect(appBuilder.build()).rejects.toThrow();
        });

        it('should call registerServices and configureServices on the bound Core.IStartup', async () => {
            @injectable()
            class CoreStartup implements IStartup {
                async configureServices() {}
                async registerServices() {}
            }

            const coreStartup = new CoreStartup();

            const registerSpy = jest.spyOn(coreStartup, 'registerServices');
            const configureSpy = jest.spyOn(coreStartup, 'configureServices');

            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);

            await appBuilder.build();

            expect(registerSpy).toHaveBeenCalled();
            expect(configureSpy).toHaveBeenCalled();
        });

        it('should call registerServices and configureServices on all bound IStartup instances', async () => {
            @injectable() class CoreStartup implements IStartup {
                async configureServices() {}
                async registerServices() {}
            }

            @injectable() class AppStartup implements IStartup {
                async configureServices() {}
                async registerServices() {}
            }

            const coreStartup = new CoreStartup();
            const appStartup = new AppStartup();

            const registerCoreSpy = jest.spyOn(coreStartup, 'registerServices');
            const configureCoreSpy = jest.spyOn(coreStartup, 'configureServices');
            const registerAppSpy = jest.spyOn(appStartup, 'registerServices');
            const configureAppSpy = jest.spyOn(appStartup, 'configureServices');

            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);
            container.bind(TYPES.Core.IStartup).toConstantValue(appStartup);

            await appBuilder.build();

            expect(registerCoreSpy).toHaveBeenCalled();
            expect(configureCoreSpy).toHaveBeenCalled();
            expect(registerAppSpy).toHaveBeenCalled();
            expect(configureAppSpy).toHaveBeenCalled();
        });

        it('should resolve and return the Application instance', async () => {
            @injectable()
            class CoreStartup implements IStartup {
                async configureServices() {}
                async registerServices() {}
            }

            const coreStartup = new CoreStartup();
            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);

            const application = await appBuilder.build();

            expect(application).toBeInstanceOf(Application);
        });
    });
});
