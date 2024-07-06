import { Container } from "inversify";
import { globSync } from "glob";
import "reflect-metadata";
import InMemoryCommandLoader from "../../../../../src/cli/infrastructure/loaders/InMemoryCommandLoader";
import { CommandMetadataKey } from "../../../../../src/cli/domain/command/decorators/Command";
import TYPES from "../../../../../src/TYPES";
import { jest } from '@jest/globals';

// Mock globSync to return specific command paths
jest.mock("glob");

// Define the CommandDecorator to apply metadata
const CommandDecorator = (metadata: { name: string }) => (target: Function) => {
    Reflect.defineMetadata(CommandMetadataKey, metadata, target);
};

// Define mock commands with decorators
@CommandDecorator({ name: "helloA" })
class Command1 {}

@CommandDecorator({ name: "helloB" })
class Command2 {}

// Mock dynamic imports
jest.mock('/mock/command/root/commands/command1/index.ts', () => ({
    default: Command1
}), { virtual: true });

jest.mock('/mock/command/root/commands/command2/index.ts', () => ({
    default: Command2
}), { virtual: true });

describe('InMemoryCommandLoader', () => {
    let container: Container;
    let commandLoader: InMemoryCommandLoader;
    const mockCommandRoot = '/mock/command/root';

    beforeEach(() => {
        container = new Container();
        commandLoader = new InMemoryCommandLoader(container, mockCommandRoot);
    });

    it("should load and register commands", async () => {
        const commandPaths = [
            "/mock/command/root/commands/command1/index.ts",
            "/mock/command/root/commands/command2/index.ts"
        ];

        (globSync as jest.Mock).mockReturnValue(commandPaths);

        await commandLoader.loadAll();

        const registeredCommand1 = container.get(TYPES.CLI.ICommand);
        const registeredCommand2 = container.get(TYPES.CLI.ICommand);

        expect(registeredCommand1).toBeInstanceOf(Command1);
        expect(registeredCommand2).toBeInstanceOf(Command2);

        const metadata1 = Reflect.getMetadata(CommandMetadataKey, Command1);
        const metadata2 = Reflect.getMetadata(CommandMetadataKey, Command2);

        expect(metadata1).toEqual({ name: "helloA" });
        expect(metadata2).toEqual({ name: "helloB" });
    });
});
