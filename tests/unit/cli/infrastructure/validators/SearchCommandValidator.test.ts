import "reflect-metadata";
import { Container } from "inversify";
import SearchCommandValidator from "../../../../../src/cli/infrastructure/validators/SearchCommandValidator"
import ICommandService from "../../../../../src/cli/domain/services/ICommandService";
import TYPES from "../../../../../src/TYPES";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import NoInputError from "../../../../../src/cli/domain/errors/NoInputError";
import ICommandSearch from "../../../../../src/cli/domain/models/commands/ICommandSearch";
import CommandNotFoundError from "../../../../../src/cli/domain/errors/CommandNotFoundError";
import CoreApplicationError from "../../../../../src/core/domain/errors/CoreApplicationError";
import ICommandArgument from "../../../../../src/cli/domain/models/commands/ICommandArgument";
import InvalidParameterError from "../../../../../src/cli/domain/errors/InvalidParameterError";
import MissingParameterError from "../../../../../src/cli/domain/errors/MissingParameterError";

describe("SearchCommandValidator", () => {
    let validator: SearchCommandValidator;
    let mockCommandService: ICommandService;

    beforeEach(() => {
        const container = new Container();
        mockCommandService = {
            getCommandInfo: jest.fn()
        } as unknown as ICommandService;

        container.bind<ICommandService>(TYPES.CLI.Services.ICommandService).toConstantValue(mockCommandService);
        validator = container.resolve(SearchCommandValidator);
    });

    it("should return NoInputError if search is not provided", async () => {
        const errors = await validator.validate(undefined, {} as ICommand);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(NoInputError);
    });

    it("should return CommandNotFoundError if command is not provided", async () => {
        const errors = await validator.validate({} as ICommandSearch, undefined);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(CommandNotFoundError);
    });

    it("should return CoreApplicationError if no commandInfo is found for the command", async () => {
        class CommandMock implements ICommand {async invoke() {}}
        const mockCommand = new CommandMock();
        (mockCommandService.getCommandInfo as jest.Mock).mockReturnValue(null);

        const errors = await validator.validate({} as ICommandSearch, mockCommand);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(CoreApplicationError);
        expect(errors[0].details).toBe("No commandInfo found for CommandMock");
    });

    it("should return InvalidParameterError if required parameter is missing", async () => {
        class CommandMock implements ICommand {async invoke() {}}
        const mockCommand = new CommandMock();
        const commandInfo = {
            arguments: [
                { prefix: "--requiredArg", description: "A required argument", required: true }
            ]
        };
        (mockCommandService.getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

        const search = { args: [] as ICommandArgument[] } as ICommandSearch;
        const errors = await validator.validate(search, mockCommand);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(MissingParameterError);
        expect(errors[0].details).toBe("--requiredArg has not been set");
    });

    it("should return InvalidParameterError if required parameter has no value", async () => {
        class CommandMock implements ICommand {async invoke() {}}
        const mockCommand = new CommandMock();
        const commandInfo = {
            arguments: [
                { prefix: "--requiredArg", description: "A required argument", required: true }
            ]
        };
        (mockCommandService.getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

        const search = { args: [{ prefix: "--requiredArg", value: undefined }] } as ICommandSearch;
        const errors = await validator.validate(search, mockCommand);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(InvalidParameterError);
        expect(errors[0].details).toBe("--requiredArg has no value");
    });

    it("should return an empty array if validation passes", async () => {
        class CommandMock implements ICommand {async invoke() {}}
        const mockCommand = new CommandMock();
        const commandInfo = {
            arguments: [
                { prefix: "--requiredArg", description: "A required argument", required: true }
            ]
        };
        (mockCommandService.getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

        const search = { args: [{ prefix: "--requiredArg", value: "someValue" }] } as ICommandSearch;
        const errors = await validator.validate(search, mockCommand);
        expect(errors).toHaveLength(0);
    });
});
