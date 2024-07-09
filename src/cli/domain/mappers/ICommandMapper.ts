import CommandCollection from "../models/commands/collections/CommandCollection";
import NamedCommandCollection from "../models/commands/collections/NamedCommandCollection";

interface ICommandMapper { 
    collectionToNamedCollection(
        commands: CommandCollection
    ): NamedCommandCollection
}

export default ICommandMapper;