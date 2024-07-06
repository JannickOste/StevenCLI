import ApplicationError from "./ApplicationError";

export default class InternalApplicationError extends ApplicationError
{
    constructor(
        details?: string
    ) {
        super(
            details
        )
    }
}