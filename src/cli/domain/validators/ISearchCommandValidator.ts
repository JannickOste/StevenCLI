import ICommand from "../../domain/models/commands/ICommand";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import CLIError from "../errors/CLIError";

export interface ISearchCommandValidator {
    validate(search?: ICommandSearch, command?: ICommand): Promise<CLIError[]>;
}
