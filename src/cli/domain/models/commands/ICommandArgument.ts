export default interface ICommandArgument 
{
    prefix: string;
    description?: string;
    default?: unknown; 
    required?: boolean;
    value?: string|boolean|string[];
}