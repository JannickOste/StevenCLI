import ICommand from "../../domain/models/commands/ICommand";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";

export interface ICommandSearchMapper {
    mapSearchToCommand(
        search: ICommandSearch,
        command: ICommand
    ): ICommandSearch;
}
