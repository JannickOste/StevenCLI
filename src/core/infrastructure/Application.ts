import { injectable } from "inversify"
import ApplicationError from "../domain/errors/ApplicationError";
import "reflect-metadata"
import container from "./di/DependencyContainer";
import CommandManager from "../../cli/infrastructure/managers/CommandManager";

@injectable()
export default class Application 
{
    public async main(): Promise<void> 
    {
        try 
        {
            container.resolve(
                CommandManager
            ).invokeWithArgv(process.argv.slice(2))
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