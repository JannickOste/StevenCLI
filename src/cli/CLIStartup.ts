import { Container, inject, injectable } from "inversify";
import "reflect-metadata"
import TYPES from "../TYPES";
import IStartup from "../core/domain/IStartup";
import ICommandSearchParser from "./domain/parsers/ICommandSearchParser";
import CommandSearchParser from "./infrastructure/parsers/CommandSearchParser";

@injectable()
export default class CLIStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        this.container.bind<ICommandSearchParser>(TYPES.CLI.Parsers.ICommandSearchParser).to(CommandSearchParser)
    }

    async configureServices(): Promise<void> {
    }
}