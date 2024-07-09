import CommandCollection from "../models/commands/collections/CommandCollection";
import ICommand from "../models/commands/ICommand";
import ICommandConstructor from "../models/commands/ICommandConstructor";
import ICommandInfo from "../models/commands/ICommandInfo";

export default interface ICommandService {
    getCommandInfo(command: ICommandConstructor): ICommandInfo | undefined;
    getAll(): Promise<CommandCollection>;
    getCommandByName(name: string): Promise<ICommand | undefined>;

}
