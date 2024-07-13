import { injectable } from "inversify";
import ICommandInfo from "../../domain/models/commands/ICommandInfo";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import ICommand from "../../domain/models/commands/ICommand";
import getCommandInfo from "../helpers/getCommandInfo";
import { ICommandInfoSerializer } from "../../domain/serializers/ICommandInfoSerializer";

@injectable()
export default class CommandInfoSerializer implements ICommandInfoSerializer
{ 
    serialize(
        commandInfo: ICommandInfo
    ): string
    {
        type JSONReplacerFunction<K extends string> = (arg0: K, arg1: unknown) => unknown;
        const replacer: JSONReplacerFunction<keyof ICommandInfo> = (key: keyof ICommandInfo, value: unknown) => {
            if (key === 'children' && Array.isArray(value)) {
                return value.map((child: ICommand) => getCommandInfo(child.constructor as ICommandConstructor));
            }

            return value;
        };

        return JSON.stringify(commandInfo, replacer as JSONReplacerFunction<string>);
    }
}
