import ICommand from "../command/ICommand";

export default interface ICommandRepository 
{ 
    getAll(): Promise<ICommand[]>
}