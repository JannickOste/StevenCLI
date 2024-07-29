import ICommandArgument from "./ICommandArgument";
import ICommandConstructor from "./ICommandConstructor";

export default interface ICommandInfo
{
    name: string; 
    description?:string;
    arguments?: ICommandArgument[];
    
    children?: ICommandConstructor[]
}
