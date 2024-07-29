import ICommandArgument from "./ICommandArgument";
import CommandArgumentValueType from "./CommandArgumentValueType";
import ICommandConstructor from "./ICommandConstructor";

export default interface ICommandInfo
{
    name: string; 
    description?:string;
    arguments?: ICommandArgument[];
    
    children?: ICommandConstructor[]
}
