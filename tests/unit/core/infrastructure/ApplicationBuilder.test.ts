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
    })

    describe("setStartup", () => {
        it('should bind startup to the Core.IAppStartup symbol type', () => {
            appBuilder.setStartUp(class implements IStartup { async configureServices(){} async registerServices() {}})
            
            expect(container.isBound(TYPES.Core.IStartup)).toBe(true);
        });

        it('should display a warning message when setStartUp is called twice or more', () => {
            class MockStartup implements IStartup { async configureServices(){} async registerServices() {}}

            console.warn = jest.fn();
            appBuilder.setStartUp(MockStartup)
                      .setStartUp(MockStartup);
            
            expect(console.warn).toHaveBeenCalledTimes(1);
        });
    });

    describe("build", () => {
        it('should throw an error if Core.ICoreStartup is not bound', async () => {
            await expect(appBuilder.build()).rejects.toThrow("No core application startup bound");
        });

        it('should call configureServices on only ICoreStartup if IAppStartup is not bound bound', async () => {
            @injectable() 
            class CoreStartup implements IStartup { async configureServices(){} async registerServices() {}}

            const coreStartup = new CoreStartup();

            const jestSpyCore = jest.spyOn(coreStartup, 'configureServices');

            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);

            await appBuilder.build();

            expect(jestSpyCore).toHaveBeenCalled();
        });

        it('should call configureServices on both ICoreStartup and IAppStartup if they are bound', async () => {
            @injectable() class CoreStartup implements IStartup { async configureServices(){} async registerServices() {}}
            @injectable() class AppStartup implements IStartup { async configureServices(){} async registerServices() {}}
            const coreStartup = new CoreStartup();
            const appStartup = new AppStartup();

            const jestSpyCore = jest.spyOn(coreStartup, 'configureServices');
            const jestSpyApp = jest.spyOn(appStartup, 'configureServices');

            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);
            container.bind(TYPES.Core.IStartup).toConstantValue(appStartup);

            await appBuilder.build();

            expect(jestSpyCore).toHaveBeenCalled();
            expect(jestSpyApp).toHaveBeenCalled();
        });

         it('should resolve and return the Application instance', async () => {           
            @injectable() class CoreStartup implements IStartup { async configureServices(){} async registerServices() {}}
            const coreStartup = new CoreStartup();
            container.bind(TYPES.Core.IStartup).toConstantValue(coreStartup);
            
            const application = await appBuilder.build();

            expect(application instanceof Application).toBeTruthy();
         });
    });
});
