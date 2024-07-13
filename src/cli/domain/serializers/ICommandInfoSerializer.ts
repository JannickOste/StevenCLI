import ICommandInfo from "../../domain/models/commands/ICommandInfo";

export interface ICommandInfoSerializer {
    serialize(
        commandInfo: ICommandInfo
    ): string;
}
