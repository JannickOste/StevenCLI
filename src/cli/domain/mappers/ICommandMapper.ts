import CommandCollection from "../../domain/collections/CommandCollection";
import NamedCommandCollection from "../../domain/collections/NamedCommandCollection";

interface ICommandMapper { 
    collectionToNamedCollection(
        commands: CommandCollection
    ): NamedCommandCollection
}

export default ICommandMapper;