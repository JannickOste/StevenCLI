import { injectable } from "inversify";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import ICommand from "../../domain/models/commands/ICommand";
import CoreApplicationError from "../../../core/domain/errors/CoreApplicationError";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import { ICommandSearchMapper } from "../../domain/mappers/ICommandSearchMapper";
import getCommandInfo from "../helpers/getCommandInfo";

@injectable()
export default class CommandSearchMapper implements ICommandSearchMapper
{ 

    mapSearchToCommand(
        search: ICommandSearch,
        command: ICommand
    ): ICommandSearch 
    {
        const commandInfo = getCommandInfo(command.constructor as ICommandConstructor)
        if(!commandInfo)
        {
            throw new CoreApplicationError()
        }
        

        const searchSuffix = search.name.split(`${commandInfo.name}/`)[1];
        if(searchSuffix)
        {
            const suffixSegments = searchSuffix.split("/"); 
            const namedOptional = commandInfo.arguments?.find(arg => /^\[(.?)+\]$/.test(arg.prefix)); 
            const hasItterableOptional = commandInfo.arguments?.find(arg => arg.prefix === "*") !== undefined; 

            if(namedOptional)
            {
                search.args = [
                    ...search.args, 
                    {
                        prefix: commandInfo.arguments?.find(arg => /^\[(.?)+\]$/.test(arg.prefix))?.prefix ?? "",
                        value: suffixSegments[0]
                    }
                ]
            }

            if(hasItterableOptional)
            {
                search.args = [
                    ...search.args, 
                    {
                        prefix: "*",
                        value: suffixSegments
                    }
                ]
            }
        }
 

        const oldArgs = search.args;
        search.args = []
        for(const argument of commandInfo.arguments ?? [])
        {
            const availablePrefixes = argument.prefix.split(/,\s*/)
            const existingArgument = oldArgs.find(v => availablePrefixes.includes(v.prefix));
            const newValue = (existingArgument?.value ?? argument.default) as string | boolean | undefined ;

            search.args.push({
                ... argument, 
                value: newValue
            })
        }

        return search;
    }
}