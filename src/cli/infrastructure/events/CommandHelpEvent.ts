import {  inject, injectable } from "inversify";
import AAplicationEvent from "../../../core/domain/events/AAplicationEvent";
import TYPES from "../../../TYPES";
import ICommandService from "../../domain/services/ICommandService";
import ICommandTextService from "../../domain/services/ICommandTextService";
import ICommand from "../../domain/models/commands/ICommand";
import getCommandInfo from "../helpers/getCommandInfo";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import { ICommandInfoSerializer } from "../../domain/serializers/ICommandInfoSerializer";

@injectable()
export default class CommandHelpEvent extends AAplicationEvent
{
    constructor(
        @inject(TYPES.CLI.Services.ICommandService) private readonly commandService: ICommandService,
        @inject(TYPES.CLI.Services.ICommandTextService) private readonly textService: ICommandTextService,
        @inject(TYPES.CLI.Serializers.ICommandInfoSerializers) private readonly commandSerializer: ICommandInfoSerializer
    ) {
        super();
    }
    
    private displayCommandObject(target: unknown, depth: number = 0) {
        const getIndentedLine = (depthAddition: number = 0) => " ".repeat(depth + depthAddition) + ">>";
        const depthIncrement = 4;
        
        if (target) { 
            //!TODO: Look into double line escape.
            switch (typeof target) {
                case "object":
                    if (Array.isArray(target)) {
                        target.forEach((child: unknown) => this.displayCommandObject(child, depth + depthIncrement));
                    } else {
                        const entries: [string, unknown][] = Object.entries(target)
                        entries.forEach(([key, child], index) => {
                            if (typeof child === "object") {
                                if (Array.isArray(child) && child.length > 0) {
                                    console.log(getIndentedLine(depthIncrement / 2) + ` ${key}:`);
                                    this.displayCommandObject(child, depth + depthIncrement);
                                } else {
                                    console.log(getIndentedLine() + ` ${key}:`);
                                    this.displayCommandObject(child, depth + depthIncrement);
                                }
                            } else {
                                if(key === "name")
                                {
                                    depth += ((`${child}`.match(/\//g)?.length ?? 0)*2)
                                    child = `${child}`.replace(/\//g, " ")
                                }

                                console.log(getIndentedLine() + ` ${key}: ${child}`);
                                if (index === entries.length - 1) {
                                    console.log("\n");
                                }
                            }
                        });
                    }
                    break;
                default:
                    console.log(`${getIndentedLine(depthIncrement)} ${target}`);
                    break;
            }
        }
    }

    public async invoke(
        commandModelType?: ICommand
    ) {
        const printQueue = commandModelType 
                            ? [commandModelType]
                            : await this.commandService.getAll();
    
        printQueue.forEach(
            command => {
                const commandInfo = getCommandInfo(command.constructor as ICommandConstructor);
                if(commandInfo)
                {
                    const normalizedObject: unknown = JSON.parse(this.commandSerializer.serialize(
                        commandInfo
                    ));
    
                    this.displayCommandObject(normalizedObject, 2)
                }
            }
        )

    }
}