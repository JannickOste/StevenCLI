import 'reflect-metadata';
import { Container } from "inversify";
import { globSync } from "glob";
import InMemoryCommandLoader from "../../../../../src/cli/infrastructure/loaders/InMemoryCommandLoader";
import CommandDecorator from "../../../../../src/cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import path from 'path';

jest.mock("glob", () => ({
  globSync: jest.fn(),
}));

@CommandDecorator({name: "ValidTestCommand"}) 
class ValidTestCommand implements ICommand { invoke() {} }
jest.mock("/fake/command/root/valid.ts", () => ({
  __esModule: true,
  default: ValidTestCommand,
}), { virtual: true });

describe('InMemoryCommandLoader', () => {
    let container: Container = new Container();
    let loader: InMemoryCommandLoader;
    const COMMAND_ROOT = "/fake/command/root";

    beforeEach(() => {
        container.snapshot();
        loader = new InMemoryCommandLoader(container, COMMAND_ROOT);
    });

    afterEach(() => {
        jest.clearAllMocks();
        container.restore();
    });

    describe('loadAll', () => {
        it('should load command barrel files with parameters absolute set and the constructor specified COMMAND_ROOT as CWD', async () => {
            const mockCommandPath = path.join(COMMAND_ROOT, "command/valid.ts");
            const mockCommandModule = {default: ValidTestCommand };

            (globSync as jest.Mock).mockReturnValue([mockCommandPath]);
            jest.doMock(mockCommandPath, () => mockCommandModule, { virtual: true });

            await loader.loadAll();

            expect(globSync).toHaveBeenCalledWith(`*/index.{ts,js}`, {
                absolute: true,
                cwd: COMMAND_ROOT
            });
        });

        it('should register loaded commands from specified COMMAND_ROOT', async () => {
            const mockCommandPath = path.join(COMMAND_ROOT, "command/valid.ts");
            const mockCommandModule = {default: ValidTestCommand };

            (globSync as jest.Mock).mockReturnValue([mockCommandPath]);
            jest.doMock(mockCommandPath, () => mockCommandModule, { virtual: true });

            const registerCommandSpy = jest.spyOn(loader as any, 'registerCommand');

            await loader.loadAll();

            expect(registerCommandSpy).toHaveBeenCalledWith(mockCommandModule);
        });
    });

    describe("registerCommand", () => {
        it('should not register commands without valid metadata', async () => {
            class InvalidCommand {}
            const mockCommandPath = "/fake/command/root/invalidCommand/index.ts";
            const registerCommandSpy = jest.spyOn(loader as any, 'registerCommand');
            
            (globSync as jest.Mock).mockReturnValue([mockCommandPath]);
            jest.doMock(mockCommandPath, () => ({ __esModule: true, default: InvalidCommand }), { virtual: true });

            
            await loader.loadAll();
      
      
            expect(registerCommandSpy).toHaveBeenCalledTimes(1);
            expect(registerCommandSpy).toHaveBeenCalledWith(InvalidCommand);
            expect(registerCommandSpy).toHaveReturned()
          });
    })
});
