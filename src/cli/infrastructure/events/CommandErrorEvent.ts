import { Container, inject, injectable } from "inversify";
import AAplicationEvent from "../../../core/domain/events/AAplicationEvent";
import TYPES from "../../../TYPES";
import ApplicationError from "../../../core/domain/errors/ApplicationError";
import ICommandSearch from "../command/ICommandSearch";

@injectable()
export default class CommandErrorEvent extends AAplicationEvent
{
    constructor(
        @inject(TYPES.Container) private readonly container: Container
    ) {
        super();
    }

    public async invoke(
        errors: ApplicationError | ApplicationError[],
        search?: ICommandSearch
    ) {
        const displayError = (err: CLIErrorBase) => {
            console.log(err.message)
            if(err.details)
            {
                console.log(`- ${err.details}`)
            }
        }

        if(!Array.isArray(errors))
        {
            displayError(errors)
            errors = [errors]
        }
        else 
        {
            for(const error of errors)
            {
                displayError(error)
                console.log("\n")
            }
        }

        if(search && !(errors.length === 1 && errors.at(0) instanceof CommandNotFoundError))
        {
            const args = []
            for(const arg of search.args)
            {
                if(arg.prefix.length) break;

                args.push(arg.value)
            }

            console.log(`\nTry running "${search.name.split("/").join(" ")} --help" to display additional information.`)
        }
    }
}