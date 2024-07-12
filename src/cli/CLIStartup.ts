import { Container, inject, injectable } from "inversify";
import "reflect-metadata"
import TYPES from "../TYPES";
import IStartup from "../core/domain/IStartup";
import ICommandSearchParser from "./domain/parsers/ICommandSearchParser";
import CommandSearchParser from "./infrastructure/parsers/CommandSearchParser";
import InMemoryCommandLoader from "./infrastructure/loaders/InMemoryCommandLoader";
import { ICommandLoader } from "./domain/loaders/ICommandLoader";
import ENV_CONFIG from "../ENV_CONFIG";
import path from "path";
import ICommandRepository from "./domain/repositories/ICommandRepository";
import InMemoryCommandRepository from "./infrastructure/repositories/InMemoryCommandRepository";
import ICommandService from "./domain/services/ICommandService";
import CommandService from "./infrastructure/services/CommandService";
import { ISearchCommandValidator } from "./domain/validators/ISearchCommandValidator";
import SearchCommandValidator from "./infrastructure/validators/SearchCommandValidator";

@injectable()
export default class CLIStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        this.container.bind<ICommandSearchParser>(TYPES.CLI.Parsers.ICommandSearchParser).to(CommandSearchParser)
        this.container.bind<ICommandLoader>(TYPES.CLI.Loaders.ICommandLoader).to(InMemoryCommandLoader);
        this.container.bind<ICommandRepository>(TYPES.CLI.Repositories.ICommandRepository).to(InMemoryCommandRepository);
        this.container.bind<string>(TYPES.CLI.Constants.COMMAND_ROOT).toConstantValue(
            path.join(
                ENV_CONFIG.projectRoot,
                __filename.endsWith(".ts") ? ENV_CONFIG.sourceDir : ENV_CONFIG.buildDir,
                "app",
                "commands"
            )
        )

        this.container.bind<ISearchCommandValidator>(TYPES.CLI.Validators.ISearchCommandValidator).to(SearchCommandValidator);
        this.container.bind<ICommandService>(TYPES.CLI.Services.ICommandService).to(CommandService)
    }

    async configureServices(): Promise<void> {

        for(const commandLoader of this.container.getAll<ICommandLoader>(TYPES.CLI.Loaders.ICommandLoader))
        {
            await commandLoader.loadAll()
        }

    }
}