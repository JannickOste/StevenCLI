import {  injectable } from "inversify";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import ICommandMapper from "../../domain/mappers/ICommandMapper";
import "reflect-metadata"
import CommandCollection from "../../domain/models/commands/collections/CommandCollection";
import NamedCommandCollection from "../../domain/models/commands/collections/NamedCommandCollection";
import getCommandInfo from "../helpers/getCommandInfo";

@injectable()
export default class CommandMapper implements ICommandMapper 
{ 

    collectionToNamedCollection(
        commands: CommandCollection
    ): NamedCommandCollection {
        return Object.fromEntries(
            commands.map(
                (command): [string | undefined, ICommand] => {
                    const commandName = getCommandInfo(command.constructor as ICommandConstructor)?.name; 

                    return [commandName, command];
                }
            ).filter(command => typeof command[0] !== "undefined")
        ) as Record<string, ICommand>;
    }
}