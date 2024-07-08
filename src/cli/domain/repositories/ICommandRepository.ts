import CommandCollection from "../models/collections/CommandCollection";
export default interface ICommandRepository 
{ 
    getAll(): Promise<CommandCollection>
}