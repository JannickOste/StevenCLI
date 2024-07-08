import ICommand from "../models/commands/ICommand";
import ICommandInfo from "../models/commands/ICommandInfo";

export default interface ICommandService {
    getCommandInfo(command: new() => ICommand): ICommandInfo | undefined;
    getAll(): Promise<Array<ICommand>>;
    getCommandByName(name: string): Promise<ICommand | undefined>;

}
