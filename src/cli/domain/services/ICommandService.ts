import ICommand from "../command/ICommand";
import ICommandInfo from "../command/ICommandInfo";

export default interface ICommandService {
    getCommandInfo(command: new() => ICommand): ICommandInfo | undefined;
    getAll(): Promise<Array<ICommand>>;
    getCommandByName(name: string): Promise<ICommand | undefined>;

}
