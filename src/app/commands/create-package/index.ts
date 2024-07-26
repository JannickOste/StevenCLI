import { inject } from "inversify"
import CommandDecorator from "../../../cli/domain/models/commands/decorators/Command"
import TYPES from "../../../TYPES"
import EventManager from "../../../core/infrastructure/managers/EventManager"
import ICommand from "../../../cli/domain/models/commands/ICommand"
import CommandHelpEvent from "../../../cli/infrastructure/events/CommandHelpEvent"
import ICommandConstructor from "../../../cli/domain/models/commands/ICommandConstructor"
import CreateTypescriptPackageCommand from "./typescript"

@CommandDecorator({
    name: "create-package", 
    description: "Create a package enviroment for your favorite coding languages.",
    children: [
        CreateTypescriptPackageCommand,
    ],
})
export default class CreatePackageCommandGroup implements ICommand
{
    constructor(
        @inject(TYPES.Core.Events.IEventManager) private readonly eventManager: EventManager
    ) { 
        
    }
    
    invoke = () => {
        this.eventManager.emitSync(
            CommandHelpEvent,
            this.constructor as ICommandConstructor
        )
    }
}