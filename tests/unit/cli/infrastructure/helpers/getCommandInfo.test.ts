import "reflect-metadata";
import CommandCollection from "../../../../../src/cli/domain/models/commands/collections/CommandCollection";
import { CommandMetadataKey } from "../../../../../src/cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import ICommandInfo from "../../../../../src/cli/domain/models/commands/ICommandInfo";
import ICommandRepository from "../../../../../src/cli/domain/repositories/ICommandRepository";
import getCommandInfo from "../../../../../src/cli/infrastructure/helpers/getCommandInfo";
import ICommandConstructor from "../../../../../src/cli/domain/models/commands/ICommandConstructor";

describe("getCommandInfo", () => {
    let command: jest.Mocked<ICommand>;
    let repository: jest.Mocked<ICommandRepository>;

    beforeEach(() => {
        command = { invoke: jest.fn() } as jest.Mocked<ICommand>;
        repository = { getAll: jest.fn() } as jest.Mocked<ICommandRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return ICommandInfo when valid metadata is present', async () => {
        Reflect.defineMetadata(CommandMetadataKey, { name: "TestCommand" }, command.constructor);
        repository.getAll.mockResolvedValueOnce([command]);
        const expected: ICommandInfo = { name: 'TestCommand' };

        const result = getCommandInfo(command.constructor as ICommandConstructor);

        expect(result).toEqual(expected);
    });

    it('should return undefined if metadata is not an object', () => {
        Reflect.defineMetadata(CommandMetadataKey, "InvalidString", command.constructor);
        const result = getCommandInfo(command.constructor as ICommandConstructor);

        expect(result).toBeUndefined();
    });

    it('should return undefined if metadata is missing the name property', () => {
        Reflect.defineMetadata(CommandMetadataKey, {}, command.constructor);

        const result = getCommandInfo(command.constructor as ICommandConstructor);

        expect(result).toBeUndefined();
    });

    it('should return undefined if metadata is not defined', () => {
        Reflect.deleteMetadata(CommandMetadataKey, command.constructor);

        const result = getCommandInfo(command.constructor as ICommandConstructor);

        expect(result).toBeUndefined();
    });
});
