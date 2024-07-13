import CommandCollection from "../models/commands/collections/CommandCollection";

export default interface ICommandRepository 
{ 
    getAll(): Promise<CommandCollection>
}