import ApplicationError from "../../../core/domain/errors/ApplicationError";

export default class CLIError extends ApplicationError
{ 

    constructor(
        details?: string
    ) {
        super(
            2,
            details
        )
    }
}