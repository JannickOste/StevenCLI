import { inject } from "inversify";
import ICommandService from "../../domain/services/ICommandService";
import TYPES from "../../../TYPES";
import ICommandRepository from "../../domain/repositories/ICommandRepository";
import ICommand from "../../domain/command/ICommand";
import ICommandInfo from "../../domain/command/ICommandInfo";
import { CommandMetadataKey } from "../../domain/command/decorators/Command";
import ICommandConstructor from "../../domain/command/ICommandConstructor";

export default class CommandService implements ICommandService 
{
    constructor(
        @inject(TYPES.CLI.Repositories.ICommandRepository) private readonly repository: ICommandRepository
    ) {

    }

    getCommandInfo(command: new () => ICommand): ICommandInfo | undefined {
        const metadata: unknown = Reflect.getMetadata(CommandMetadataKey, command);
        if(!metadata || typeof metadata !== "object" || !("name" in metadata))
            return undefined;

        return (metadata as ICommandInfo);
    }

    getAll(): Promise<Array<ICommand>> {
        return this.repository.getAll();
    }

    async getCommandByName(name: string): Promise<ICommand | undefined> {
        
        if(typeof name === "string" && name.length)
            {
                const commands = (await this.getAll());
                const nameSegments = name.split("/")
    
                do 
                {
                    const currentName = nameSegments.join("/")
    
                    for(let command of commands)
                    {
                        const currentCommandInfo = this.getCommandInfo(command.constructor as ICommandConstructor);
                        if(currentCommandInfo?.name === currentName)
                        {
                            return command;
                        }
                    }
                    
                    nameSegments.pop()
                } while(nameSegments.length)
            }
    
            return undefined;
    }
}
