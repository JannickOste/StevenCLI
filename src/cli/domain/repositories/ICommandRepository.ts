import ICommand from "../models/commands/ICommand";

export default interface ICommandRepository 
{ 
    getAll(): Promise<ICommand[]>
}