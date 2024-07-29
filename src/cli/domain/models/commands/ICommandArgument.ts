import  CommandArgumentValueType  from "./CommandArgumentValueType";

export default interface ICommandArgument 
{
    prefix: string;
    description?: string;
    default?: unknown; 
    required?: boolean;
    value?: CommandArgumentValueType;
    options?: CommandArgumentValueType[]
}