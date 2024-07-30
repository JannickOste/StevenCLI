import { inject, injectable } from "inversify";
import AAplicationEvent from "../../../core/domain/events/AAplicationEvent";
import TYPES from "../../../TYPES";
import ICommandService from "../../domain/services/ICommandService";
import ICommand from "../../domain/models/commands/ICommand";
import getCommandInfo from "../helpers/getCommandInfo";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import { ICommandInfoSerializer } from "../../domain/serializers/ICommandInfoSerializer";

@injectable()
export default class CommandHelpEvent extends AAplicationEvent {
    constructor(
        @inject(TYPES.CLI.Services.ICommandService) private readonly commandService: ICommandService,
        @inject(TYPES.CLI.Serializers.ICommandInfoSerializers) private readonly commandSerializer: ICommandInfoSerializer
    ) {
        super();
    }

    private processObject(obj: object, depth: number = 1): string[] {
        const lines: string[] = [];
        const entries = Object.entries(obj);
        const formatLine = (str: string) => ' '.repeat(depth * 2) + str;
        const addLine = (...str: string[]) => lines.push(...str.map(value => formatLine(value)));
    
        for (let index = 0; index < entries.length; index++) {
            let [key, value] = (entries[index] as [string, unknown]);
            if (!value) continue;
    
            switch (typeof value) {
                case "object":
                    if (!Array.isArray(value)) {
                        addLine(`${key}:`);
                        addLine(...this.processObject(value as object, depth + 1));
                    } else {
                        if (!value.length || !value.find(v => Boolean(v))) continue;
    
                        if (!value.find(valueArrayItem => typeof valueArrayItem === "object")) {
                            addLine(`${key}:`);
                            addLine(...value.map(v => `- ${v}`));
                        } else {
                            depth += 2
                            addLine(`${key}:`);
                            value.forEach((item) => {
                                if (typeof item === "object" && item) {
                                    addLine(...this.processObject(item as object, depth + 2));
                                    addLine(``);
                                } else {
                                    addLine(`- ${item}`);
                                }
    
                            });
                            depth -= 2
                        }
                    }
                    break;
                default:
                    if (key === "name") {
                        value = `${value}`.replace(/\//g, " ");
                    }

                    addLine(`${key}: ${value}`);
                    break;
            }
    
        }
    
        return lines;
    }
    

    // TODO: Disgusting, needs much better implementation
    private displayCommandObject(target: unknown) {
        const boxLine = (char: string, length: number) => char.repeat(length);

        const displayBox = (content: string[]) => {
            const lineWidth = Math.max(... content.map(str => str.length));
            console.log(`┌${boxLine('─', lineWidth + 2)}┐`);
            content.forEach(line => console.log(`│${line.padEnd(lineWidth+2)}│`));
            console.log(`└${boxLine('─', lineWidth + 2)}┘`);
        };



        if (typeof target === "object" && target !== null) {
            const content = this.processObject(target);
            displayBox(content);
        } else {
            console.log(target);
        }
    }

    public async invoke(commandModelType?: ICommand) {
        const printQueue = commandModelType ? [commandModelType] : await this.commandService.getAll();
        printQueue.forEach(command => {
            try {
                const commandInfo = getCommandInfo(command.constructor as ICommandConstructor);
                if (commandInfo) {
                    const normalizedObject: unknown = JSON.parse(this.commandSerializer.serialize(commandInfo));
                    this.displayCommandObject(normalizedObject);
                }
            } catch (e) {
                console.log("Oops! Something happened");
                console.dir(e);
            }
        });
    }
}
