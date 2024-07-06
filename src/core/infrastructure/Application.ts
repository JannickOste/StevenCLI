import { injectable } from "inversify"
import ApplicationError from "../domain/errors/ApplicationError";

@injectable()
export default class Application 
{
    public async main(): Promise<void> 
    {
        try 
        {
            console.log("hello world")
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