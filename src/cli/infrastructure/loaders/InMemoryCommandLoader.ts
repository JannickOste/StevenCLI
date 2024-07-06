import { Container, inject, injectable } from "inversify";
import TYPES from "../../../TYPES";
import { CommandMetadataKey } from "../../domain/command/decorators/Command";
import { globSync } from "glob";
import { ICommandLoader } from "../../domain/loaders/ICommandLoader";

@injectable()
export default class InMemoryCommandLoader implements ICommandLoader
{ 
    constructor(
        @inject(TYPES.container) private readonly container: Container,
        @inject(TYPES.CLI.Constants.COMMAND_ROOT) private readonly COMMAND_ROOT: string
    ) {
        
    }

    private registerCommand(
        commandSource: unknown, 
        namePrefix: string = ""
    )
    {
        console.dir(typeof commandSource)
        if(!commandSource || typeof commandSource !== "function")
            return;

        const commandInfo: unknown = Reflect.getMetadata(CommandMetadataKey, commandSource)
        if(!commandInfo || typeof commandInfo !== "object" || !("name" in commandInfo))
            return;

        const newCommandInfo = {... commandInfo, name: namePrefix.length ? [namePrefix, commandInfo.name].join("/") : (`${commandInfo.name}`)};

        Reflect.deleteMetadata(CommandMetadataKey, commandSource)
        Reflect.defineMetadata(CommandMetadataKey, newCommandInfo, commandSource)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.container.bind(TYPES.CLI.ICommand).to(commandSource as any)
        
        
        if("children" in newCommandInfo && Array.isArray(newCommandInfo.children))
        {
            newCommandInfo.children.forEach(
                (child: unknown) => this.registerCommand(child, newCommandInfo.name)
            )
        }
    }

    public async loadAll(): Promise<void>
    {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const commandPaths: string[] = (globSync(`*/index.{ts,js}`, {
            absolute: true,
            cwd: this.COMMAND_ROOT
        }))! as string[];

        for(const filepath of commandPaths) {
            try 
            {
                const commandModule: unknown =  await import(filepath)
                if(commandModule  && typeof commandModule === "object" && "default" in commandModule)
                {
                    this.registerCommand(
                        commandModule.default
                    )
                }
            } 
            catch(e) 
            {
              console.dir("An error occurred when attempting to load the command from: "+filepath)
              console.dir(e)
            }
        }
    }

}