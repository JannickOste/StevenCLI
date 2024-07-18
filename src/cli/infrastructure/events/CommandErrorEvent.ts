import { Container, inject, injectable } from "inversify";
import AAplicationEvent from "../../../core/domain/events/AAplicationEvent";
import TYPES from "../../../TYPES";
import ApplicationError from "../../../core/domain/errors/ApplicationError";
import CLIError from "../../domain/errors/CLIError";
import CommandNotFoundError from "../../domain/errors/CommandNotFoundError";
import ENV_CONFIG from "../../../ENV_CONFIG";
import InvalidParemeterError from "../../domain/errors/InvalidParameterError";
import MissingParameterError from "../../domain/errors/MissingParameterError";
import NoInputError from "../../domain/errors/NoInputError";
import SubCommandItemNotFound from "../../domain/errors/SubCommandItemNotFound";

@injectable()
export default class CommandErrorEvent extends AAplicationEvent
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        super();
    }

    private displayErrors(errors: CLIError[]) 
    {
        for(const error of errors)
        {
            let errorMessage: string | undefined = undefined;

            switch(error.name)
            {
                case CommandNotFoundError.name:
                    errorMessage = `Command not found\n- Try running '${ENV_CONFIG.name} --help' to display all commands`;
                    break;

                case SubCommandItemNotFound.name: {
                    const commandSegments = error.details?.split("/") ?? [];
                    errorMessage = commandSegments.length <= 1 
                                ? 'Unknown sub item not found, error details should be specified as COMMAND_INFO.NAME/UNKOWN_ITEM'
                                : `Option '${commandSegments.at(-1)}' not found within command '${commandSegments.at(-2)}'.\n\nRun '${ENV_CONFIG.name} ${commandSegments.slice(0, commandSegments.length - 1).join(" ")} --help' to get additional command information.`;
       
                    break;
                }

                case MissingParameterError.name:
                case InvalidParemeterError.name: 
                    errorMessage = error.name;
                    if("details" in error && error.details?.length)
                    {
                        errorMessage += `: ${error.details}`
                    }
                    break;
                
                case NoInputError.name:
                    errorMessage = `Welcome to ${ENV_CONFIG.name}, try running '${ENV_CONFIG.name} --help' to display all commands`;
                    break;


                default: 
                    errorMessage = `Unkown error occcured: ${error.name}`;
                    if("details" in error && error.details?.length)
                    {
                        errorMessage += `->${error.message}`
                    }
                    break;
            }

            console.log(errorMessage)
        }
    }

    public async invoke(
        errors: ApplicationError | ApplicationError[]
    ) {

        errors = !Array.isArray(errors) ? [errors] : errors;
        this.displayErrors(errors)
    }
}