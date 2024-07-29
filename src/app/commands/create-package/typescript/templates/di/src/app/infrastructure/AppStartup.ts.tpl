import { Container, inject, injectable } from "inversify";
import TYPES from "../../TYPES";
import IStartup from "../../core/domain/IStartup";

@injectable()
export default class AppStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
      
    }

    async configureServices(): Promise<void> {
    }
}