import { inject, injectable } from "inversify";
import NamedCommandCollection from "../../domain/collections/NamedCommandCollection";
import ICommand from "../../domain/command/ICommand";
import ICommandConstructor from "../../domain/command/ICommandConstructor";
import TYPES from "../../../TYPES";
import ICommandService from "../../domain/services/ICommandService";
import CommandCollection from "../../domain/collections/CommandCollection";
import ICommandMapper from "../../domain/mappers/ICommandMapper";

@injectable()
export default class CommandMapper implements ICommandMapper 
{ 
    constructor(
        @inject(TYPES.CLI.Services.ICommandService) private readonly service: ICommandService
    ) {

    }


    collectionToNamedCollection(
        commands: CommandCollection
    ): NamedCommandCollection {
        return Object.fromEntries(
            commands.map(
                (command): [string | undefined, ICommand] => {
                    const commandName = this.service.getCommandInfo(command.constructor as ICommandConstructor)?.name; 

                    return [commandName, command];
                }
            ).filter(command => typeof command[0] !== "undefined")
        ) as Record<string, ICommand>;
    }
}