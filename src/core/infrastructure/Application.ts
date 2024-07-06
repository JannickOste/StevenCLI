import { injectable } from "inversify"

@injectable()
export default class Application 
{
    public async main(): Promise<void> 
    {
        console.log("Hello world")
    }
}