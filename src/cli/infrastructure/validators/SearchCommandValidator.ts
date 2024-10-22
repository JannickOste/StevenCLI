import { injectable } from "inversify";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import CLIError from "../../domain/errors/CLIError";
import NoInputError from "../../domain/errors/NoInputError";
import CommandNotFoundError from "../../domain/errors/CommandNotFoundError";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import CoreApplicationError from "../../../core/domain/errors/CoreApplicationError";
import ICommandArgument from "../../domain/models/commands/ICommandArgument";
import MissingParameterError from "../../domain/errors/MissingParameterError";
import { ISearchCommandValidator } from "../../domain/validators/ISearchCommandValidator";
import InvalidParemeterError from "../../domain/errors/InvalidParameterError";
import getCommandInfo from "../helpers/getCommandInfo";
import SubCommandItemNotFound from "../../domain/errors/SubCommandItemNotFound";

@injectable()
export default class SearchCommandValidator implements ISearchCommandValidator
{ 
 
    async validate(
        search?: ICommandSearch, 
        command?: ICommand
    ): Promise<CLIError[]> 
    {
        if(!search)
        {
            return [new NoInputError()]
        }

        if(!command)
        {
            return [new CommandNotFoundError()]
        }

        const commandInfo = getCommandInfo(command.constructor as ICommandConstructor);
        if(!commandInfo)
        {
            return [new CoreApplicationError(`No commandInfo found for ${command.constructor.name}`)]
        }

        if(search.name !== commandInfo.name)
        {
            const itterableOptionalArg = (commandInfo.arguments ?? []).find((arg) =>  arg.prefix ===  "*");
            const namedOptionalArg = (commandInfo.arguments ?? []).find((arg) => /^\[(.*?)+\]/.test(arg.prefix))

            const nameSuffix = search.name.split(`${commandInfo.name}/`)[1];
            const nameSuffixSegments = nameSuffix.split(/\/\s*/);
            if(!itterableOptionalArg && !namedOptionalArg)
            {
                return [new SubCommandItemNotFound([commandInfo.name, nameSuffixSegments[0]].join("/"))]
            }
        }

        const validationErrors: CLIError[] = []; 
        if("arguments" in commandInfo)
        {
            commandInfo.arguments?.filter(v => v.required).forEach((argument: ICommandArgument) => {
                const currentRequiredArgumentPrefixes = argument.prefix.split(/,\s*/)
                const foundSearchEntry = search.args.find(v => currentRequiredArgumentPrefixes.includes(v.prefix));
                
                if(!foundSearchEntry)
                {
                    validationErrors.push(new MissingParameterError(`${argument.prefix} has not been set`))
                }
                else if(foundSearchEntry.value === undefined)
                {
                    validationErrors.push(new InvalidParemeterError(`${argument.prefix} has no value`))
                }
                else if(Array.isArray(argument.options) && !argument.options.includes(foundSearchEntry.value))
                {
                    validationErrors.push(new InvalidParemeterError(`Option: ${foundSearchEntry.value} does not exist, available options: ${argument.options}`))
                }
            })
        }

        return validationErrors;
    }
}