import { injectable } from "inversify";
import ICommandInfo from "../ICommandInfo";

export const CommandMetadataKey: symbol = Symbol.for("CLI::CommandMetadata")

export default function CommandDecorator(info: ICommandInfo) {
    return function <T extends new (...args: any[]) => {}>(target: T): T {
        injectable()(target);
        
        Reflect.defineMetadata(CommandMetadataKey, info, target);

        return target;
    };
}
