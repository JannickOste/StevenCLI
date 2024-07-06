import { Container, inject, injectable } from "inversify";
import IStartup from "../domain/IStartup";
import TYPES from "../../TYPES";
import "reflect-metadata"
import ICommandSearchParser from "../../cli/domain/parsers/ICommandSearchParser";
import CommandSearchParser from "../../cli/infrastructure/parsers/CommandSearchParser";

@injectable()
export default class CoreStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async configureServices(): Promise<void> {
        this.container.bind<ICommandSearchParser>(TYPES.CLI.Parsers.ICommandSearchParser).to(CommandSearchParser)
    }
}