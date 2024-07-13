import { inject, injectable } from "inversify";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import TYPES from "../../../TYPES";
import ICommandSearchParser from "../../domain/parsers/ICommandSearchParser";
import ICommandService from "../../domain/services/ICommandService";
import CommandDispatcher from "../dispatchers/CommandDispatcher";
import ICommand from "../../domain/models/commands/ICommand";
import { ICommandSearchMapper } from "../../domain/mappers/ICommandSearchMapper";
import  ICommandManager  from "../../domain/managers/ICommandManager";

@injectable() 
export default class CommandManager implements ICommandManager 
{ 
    constructor(
        @inject(TYPES.CLI.Parsers.ICommandSearchParser) private readonly searchParser: ICommandSearchParser,
        @inject(TYPES.CLI.Services.ICommandService) private readonly commandService: ICommandService,
        @inject(TYPES.CLI.mappers.ICommandSearchMapper) private readonly searchMapper: ICommandSearchMapper,
        @inject(TYPES.CLI.Dispatchers.ICommandDispatcher) private readonly commandDispatcher: CommandDispatcher
    ) {
    }

    async invokeWithArgv(argv: string[]): Promise<void> {
        let search: ICommandSearch = this.searchParser.parseFromProgramArguments(argv);

        const command: ICommand | undefined = await this.commandService.getCommandByName(search.name)
        if(command)
        {
            search = this.searchMapper.mapSearchToCommand(
                search,
                command
            )
        }
    
        await this.commandDispatcher.dispatch(
            search,
            command
        )
    } 
}