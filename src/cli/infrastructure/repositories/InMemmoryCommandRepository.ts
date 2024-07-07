import { Container, inject, injectable } from "inversify";
import ICommand from "../../domain/command/ICommand";
import ICommandRepository from "../../domain/repositories/ICommandRepository";
import TYPES from "../../../TYPES";

@injectable()
export default class InMemoryCommandRepository implements ICommandRepository 
{
    constructor(
        @inject(TYPES.container) private readonly contianer: Container
    ) {
        
    }
 
    async getAll(): Promise<ICommand[]> {
        return this.contianer.getAll<ICommand>(TYPES.CLI.ICommand);
    } 
}