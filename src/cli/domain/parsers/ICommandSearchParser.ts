import ICommandSearch from "../models/commands/ICommandSearch";

export default interface ICommandSearchParser 
{
    parseFromProgramArguments(processArgv: string[]): ICommandSearch;
}