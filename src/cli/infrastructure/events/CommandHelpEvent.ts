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

    // TODO: Disgusting, needs much better implementation
    private displayCommandObject(target: unknown) {
        const boxLine = (char: string, length: number) => char.repeat(length);

        const displayBox = (content: string[]) => {
            const lineWidth = 50;
            console.log(`┌${boxLine('─', lineWidth - 2)}┐`);
            content.forEach(line => console.log(`│${line.padEnd(lineWidth - 2)}│`));
            console.log(`└${boxLine('─', lineWidth - 2)}┘`);
        };

        const processObject = (obj: object): string[] => {
            const lines: string[] = [];
            Object.entries(obj).forEach(([key, value], index, array) => {
                if (typeof value === "object" && value !== null) {
                    if (Array.isArray(value)) {
                        if (key === 'options') {
                            lines.push(` ${key}:`);
                            value.forEach(item => lines.push(`  - ${item}`));
                        } else {
                            lines.push(` ${key}:`);
                            value.forEach((item, idx) => {
                                if (typeof item === "object" && item) {
                                    lines.push(...processObject(item as object));
                                } else {
                                    lines.push(`  - ${item}`);
                                }
                                if (idx < `${value}`.length - 1) {
                                    lines.push(`${boxLine('─', 48)}`);
                                }
                            });
                        }
                    } else {
                        lines.push(` ${key}:`);
                        lines.push(...processObject(value as object));
                    }
                } else {
                    if (key === "name") {
                        value = `${value}`.replace(/\//g, " ");
                    }
                    lines.push(` ${key}: ${value}`);
                }
                if (index < array.length - 1 && key !== 'options') {
                    lines.push(`${boxLine('─', 48)}`);
                }
            });
            return lines;
        };

        if (typeof target === "object" && target !== null) {
            const content = processObject(target);
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
