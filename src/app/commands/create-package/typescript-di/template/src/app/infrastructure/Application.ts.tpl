import { injectable } from "inversify"
import "reflect-metadata"
import IApplication from "../../core/domain/IApplication"

@injectable()
export default class Application implements IApplication
{
    constructor(
    ) {

    }

    public async main(): Promise<void> 
    {
        console.log("Hello world")
    }
}