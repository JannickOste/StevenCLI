import { CommandMetadataKey } from "../../domain/models/commands/decorators/Command";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import ICommandInfo from "../../domain/models/commands/ICommandInfo";

const getCommandInfo = (command: ICommandConstructor): ICommandInfo | undefined => 
{
    const metadata: unknown = Reflect.getMetadata(CommandMetadataKey, command);
    if(!metadata || typeof metadata !== "object" || !("name" in metadata))
        return undefined;

    return (metadata as ICommandInfo);
}

export default getCommandInfo;