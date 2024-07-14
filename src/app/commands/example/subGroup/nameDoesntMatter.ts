import { inject } from "inversify";
import CommandDecorator from "../../../../cli/domain/models/commands/decorators/Command";
import TYPES from "../../../../TYPES";
import EventManager from "../../../../core/infrastructure/managers/EventManager";
import ICommand from "../../../../cli/domain/models/commands/ICommand";
import ICommandConstructor from "../../../../cli/domain/models/commands/ICommandConstructor";
import CommandHelpEvent from "../../../../cli/infrastructure/events/CommandHelpEvent";
import ExampleCommand from "./additionalSubGroup/neitherDoesThisOne";



@CommandDecorator({
    name: "sub-group", 
    description: "some command sub group example.",
    children: [
        ExampleCommand
    ]
})
export default class ExampleSubCommandGroup implements ICommand
{
    // Using DI, highly adviced to use an addition type definition barrel file for the application
    constructor(
        @inject(TYPES.Core.Events.IEventManager) private readonly eventManager: EventManager
    ) { 

    }

    // On command runtime
    invoke = () => this.eventManager.emitSync(
        CommandHelpEvent,
        this.constructor as ICommandConstructor
    )
}