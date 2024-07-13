import CommandCollection from "../models/commands/collections/CommandCollection";
import ICommand from "../models/commands/ICommand";

export default interface ICommandService {
    getAll(): Promise<CommandCollection>;
    getCommandByName(name: string): Promise<ICommand | undefined>;

}
