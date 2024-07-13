import ApplicationError from "./ApplicationError";

export default class CoreApplicationError extends ApplicationError
{
    constructor(
        details?: string
    ) {
        super(
            1,
            details
        )
    }
}