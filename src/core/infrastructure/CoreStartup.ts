import { Container, inject, injectable } from "inversify";
import IStartup from "../domain/IStartup";
import TYPES from "../../TYPES";
import "reflect-metadata"

@injectable()
export default class CoreStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async configureServices(): Promise<void> {

    }
}