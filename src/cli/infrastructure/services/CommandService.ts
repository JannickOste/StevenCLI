import { inject, injectable } from "inversify";
import ICommandService from "../../domain/services/ICommandService";
import TYPES from "../../../TYPES";
import ICommandRepository from "../../domain/repositories/ICommandRepository";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandInfo from "../../domain/models/commands/ICommandInfo";
import { CommandMetadataKey } from "../../domain/models/commands/decorators/Command";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import container from "../../../core/infrastructure/di/DependencyContainer";
import "reflect-metadata"
import ICommandMapper from "../../domain/mappers/ICommandMapper";
import CommandCollection from "../../domain/models/commands/collections/CommandCollection";

@injectable()
export default class CommandService implements ICommandService 
{
    constructor(
        @inject(TYPES.CLI.Repositories.ICommandRepository) private readonly repository: ICommandRepository,
        @inject(TYPES.CLI.mappers.ICommandMapper) private readonly mapper: ICommandMapper
    ) {

    }

    getCommandInfo(command: ICommandConstructor): ICommandInfo | undefined {
        const metadata: unknown = Reflect.getMetadata(CommandMetadataKey, command);
        if(!metadata || typeof metadata !== "object" || !("name" in metadata))
            return undefined;

        return (metadata as ICommandInfo);
    }

    async getAll(): Promise<CommandCollection> {
        return (await this.repository.getAll())
                          .filter(
                            (command) =>  "invoke" in command
                                        && this.getCommandInfo(command.constructor as ICommandConstructor) !== undefined
                        )
    }

    getChildByName(command: ICommandConstructor, name: string)
    {
        const info = this.getCommandInfo(command);
        if(!info || !Array.isArray(info.children)) return undefined;

        for(let child of info.children)
        {
            const childInfo = this.getCommandInfo(child);
            if(!childInfo || childInfo.name !== name) continue;

            return child;
        }

        return undefined;
    }

    async getCommandByName(name: string): Promise<ICommand | undefined> {
        
        if(typeof name === "string" && name.length)
        {
            const commands = this.mapper.collectionToNamedCollection(
                await this.getAll()
            )

            if(commands[name] !== undefined) 
            {
                return commands[name]
            }

            const nameSegments: string[] = name.split("/");
            for(const [name, command] of Object.entries(commands))
            {
                if(name !== nameSegments[0]) continue;

                nameSegments.shift()
                let current: ICommandConstructor | undefined = command.constructor as ICommandConstructor;
                do 
                {
                    const currentSegment = nameSegments.shift() ?? "";
                    
                    current = this.getChildByName(current, currentSegment)
                } while(nameSegments.length && current)

                return !current ? current : container.resolve(current);
            }
        }
        
        return undefined;
    }
}
