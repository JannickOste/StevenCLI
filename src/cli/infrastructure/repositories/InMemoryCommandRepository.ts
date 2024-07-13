import { Container, inject, injectable } from "inversify";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandRepository from "../../domain/repositories/ICommandRepository";
import TYPES from "../../../TYPES";
import "reflect-metadata"

@injectable()
export default class InMemoryCommandRepository implements ICommandRepository 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }
 
    async getAll(): Promise<ICommand[]> {
        try 
        {
            return this.container.getAll<ICommand>(TYPES.CLI.ICommand);
        }
        catch 
        {
            return []
        }
    } 
}