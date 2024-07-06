import ICommandSearch from "../command/ICommandSearch";

export default interface ICommandSearchParser 
{
    parseFromProgramArguments(processArgv: string[]): ICommandSearch;
}