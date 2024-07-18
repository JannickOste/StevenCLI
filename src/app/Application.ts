import { inject, injectable } from "inversify"
import ApplicationError from "../core/domain/errors/ApplicationError";
import "reflect-metadata"
import TYPES from "../TYPES";
import ICommandManager from "../cli/domain/managers/ICommandManager";
import IApplication from "../core/domain/IApplication";

@injectable()
export default class Application implements IApplication
{
    constructor(
        @inject(TYPES.CLI.Managers.ICommandManager) private readonly commandManager: ICommandManager
    ) {

    }

    public async main(): Promise<void> 
    {
        try 
        {
            await this.commandManager.invokeWithArgv(process.argv.slice(2))
        }
        catch(error)
        {
            if(error instanceof ApplicationError)
            {
                console.log(`[${error.name}]: ${error.details}`)
            }
            else 
            {
                console.log("Unkown error: ")
                throw error;
            }
        }
    }
}