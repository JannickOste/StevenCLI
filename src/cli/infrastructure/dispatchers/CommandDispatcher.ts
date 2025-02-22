import { inject, injectable } from "inversify";
import TYPES from "../../../TYPES";
import EventManager from "../../../core/infrastructure/managers/EventManager";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import ICommand from "../../domain/models/commands/ICommand";
import CommandErrorEvent from "../events/CommandErrorEvent";
import { ISearchCommandValidator } from "../../domain/validators/ISearchCommandValidator";
import CommandInvokeEvent from "../events/CommandInvokeEvent";
import ICommandTextService from "../../domain/services/ICommandTextService";
import CommandHelpEvent from "../events/CommandHelpEvent";

@injectable()
export default class CommandDispatcher
{
    constructor(       
        @inject(TYPES.Core.Events.IEventManager) private readonly eventManager: EventManager,
        @inject(TYPES.CLI.Validators.ISearchCommandValidator) private readonly validator: ISearchCommandValidator,
        @inject(TYPES.CLI.Services.ICommandTextService) private readonly textService: ICommandTextService
    ) {

    }

    private isHelpTrigger(
        search: ICommandSearch
    ) {
        return search.name === "--help" 
            || search.args.at(search.args.length-1)?.prefix === "--help"
    }


    public async dispatch(
        search: ICommandSearch,
        commandModelType?: ICommand
    ) {
        console.log(`${this.textService.getCLIHeader()}\n`)
        
        if(this.isHelpTrigger(search))
        {
            return this.eventManager.emitSync(
                CommandHelpEvent, 
                commandModelType
            )
        }

        const errors = await this.validator.validate(
            search, 
            commandModelType
        );

        if(errors.length || commandModelType === undefined)
        {
            return this.eventManager.emitSync(
                CommandErrorEvent,
                errors,
                search
            )
        }
        
        return this.eventManager.emitSync(
            CommandInvokeEvent,
            commandModelType, 
            Object.fromEntries(
                search.args.map(arg => [
                    arg.prefix, 
                    arg.value === undefined ? arg.default : arg.value
                ])
            )
        )
    }
}