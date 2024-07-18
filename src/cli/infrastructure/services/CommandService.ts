import { inject, injectable } from "inversify";
import ICommandService from "../../domain/services/ICommandService";
import TYPES from "../../../TYPES";
import ICommandRepository from "../../domain/repositories/ICommandRepository";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import "reflect-metadata"
import ICommandMapper from "../../domain/mappers/ICommandMapper";
import CommandCollection from "../../domain/models/commands/collections/CommandCollection";
import getCommandInfo from "../helpers/getCommandInfo";

@injectable()
export default class CommandService implements ICommandService 
{
    constructor(
        @inject(TYPES.CLI.Repositories.ICommandRepository) private readonly repository: ICommandRepository,
        @inject(TYPES.CLI.mappers.ICommandMapper) private readonly mapper: ICommandMapper
    ) {

    }

    async getAll(): Promise<CommandCollection> {
        return (await this.repository.getAll())
                          .filter(
                            (command) =>  "invoke" in command
                                        && getCommandInfo(command.constructor as ICommandConstructor) !== undefined
                        )
    }

    async getCommandByName(name: string, returnLastAccessible: boolean = true): Promise<ICommand | undefined> {

        if (typeof name === "string" && name.length) {
            const commands = this.mapper.collectionToNamedCollection(
                await this.getAll()
            );
    
            if (commands[name] !== undefined) {
                return commands[name];
            }
            
            let current: ICommand | undefined  = undefined;
            const nameSegments: string[] = name.split("/");

            for(let index = 1; index <  nameSegments.length && returnLastAccessible; index++)
            {
                const currentName = nameSegments.slice(0, index).join("/")
                const next = await this.getCommandByName(currentName, false);

                if(!next) break;
                current = next;
            }

            return current;
        }
    
        return undefined;
    }
    
}
