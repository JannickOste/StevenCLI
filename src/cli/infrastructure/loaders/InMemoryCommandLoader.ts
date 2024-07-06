import { Container, inject, injectable } from "inversify";
import TYPES from "../../../TYPES";
import { CommandMetadataKey } from "../../domain/command/decorators/Command";
import ENV_CONFIG from "../../../ENV_CONFIG";
import { globSync } from "glob";
import { ICommandLoader } from "../../domain/loaders/ICommandLoader";

@injectable()
export default class InMemoryCommandLoader implements ICommandLoader
{ 
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    private registerCommand(
        commandSource: unknown, 
        namePrefix: string = ""
    )
    {
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
        const commandPaths: string[] = (globSync(`./${(__filename.endsWith(".ts") ? ENV_CONFIG.sourceDir : ENV_CONFIG.buildDir)}/app/commands/*/index.{ts,js}`, {
            absolute: true,
            cwd: ENV_CONFIG.projectRoot
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