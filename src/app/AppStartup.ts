import { Container, inject, injectable } from "inversify";
import IStartup from "../core/domain/IStartup";
import TYPES from "../TYPES";
import "reflect-metadata"

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