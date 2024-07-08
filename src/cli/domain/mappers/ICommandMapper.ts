import CommandCollection from "../models/collections/CommandCollection";
import NamedCommandCollection from "../models/collections/NamedCommandCollection";

interface ICommandMapper { 
    collectionToNamedCollection(
        commands: CommandCollection
    ): NamedCommandCollection
}

export default ICommandMapper;