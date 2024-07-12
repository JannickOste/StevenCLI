import { inject, injectable } from "inversify";
import TYPES from "../../../TYPES";
import EventManager from "../../../core/infrastructure/managers/EventManager";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import ICommand from "../../domain/models/commands/ICommand";
import CommandErrorEvent from "../events/CommandErrorEvent";
import { ISearchCommandValidator } from "../../domain/validators/ISearchCommandValidator";
import CommandInvokeEvent from "../events/CommandInvokeEvent";

@injectable()
export default class CommandDispatcher
{
    constructor(       
        @inject(TYPES.Core.Events.IEventManager) private readonly eventManager: EventManager,
        @inject(TYPES.CLI.Validators.ISearchCommandValidator) private readonly validator: ISearchCommandValidator
    ) {

    }

    public async dispatch(
        search: ICommandSearch,
        commandModelType?: ICommand
    ) {

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