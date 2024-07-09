import { inject, injectable } from "inversify";
import ICommand from "../../domain/models/commands/ICommand";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import CLIError from "../../domain/errors/CLIError";
import NoInputError from "../../domain/errors/NoInputError";
import CommandNotFoundError from "../../domain/errors/CommandNotFoundError";
import TYPES from "../../../TYPES";
import ICommandService from "../../domain/services/ICommandService";
import ICommandConstructor from "../../domain/models/commands/ICommandConstructor";
import CoreApplicationError from "../../../core/domain/errors/CoreApplicationError";
import ICommandArgument from "../../domain/models/commands/ICommandArgument";
import InvalidParemeterError from "../../domain/errors/InvalidParameterError";

@injectable()
export default class SearchCommandValidator
{ 
    constructor(
        @inject(TYPES.CLI.Services.ICommandService) private readonly commandService: ICommandService
    ) {

    }

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

        const commandInfo = this.commandService.getCommandInfo(command.constructor as ICommandConstructor);
        if(!commandInfo)
        {
            return [new CoreApplicationError(`No commandInfo found for ${command.constructor.name}`)]
        }

        const validationErrors: CLIError[] = []; 
        if("arguments" in commandInfo)
        {
            commandInfo.arguments?.filter(v => v.required).forEach((argument: ICommandArgument) => {
                let problemStr: string | undefined = undefined;
                const currentRequiredArgumentPrefixes = argument.prefix.split(/,\s*/)
                const foundSearchEntry = search.args.find(v => currentRequiredArgumentPrefixes.includes(v.prefix));
                
                if(!foundSearchEntry)
                {
                    problemStr = `Required parameter: ${argument.prefix} has not been set`;
                }
                else if(foundSearchEntry.value === undefined)
                {
                    problemStr = `Required parameter: ${argument.prefix} has no value`
                }
    
                if(problemStr)
                {
                    validationErrors.push(new InvalidParemeterError(problemStr))
                }
            })
        }

        return validationErrors;
    }
}