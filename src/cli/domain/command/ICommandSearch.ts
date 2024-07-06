import ICommandArgument from "./ICommandArgument";

export default interface ICommandSearch {
    name: string; 
    args: ICommandArgument[];
}