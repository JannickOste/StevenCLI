export default class ApplicationError extends Error 
{

    public get name() 
    {
        return this.constructor.name;
    }

    public constructor(
        public readonly code: number,
        public readonly details?:string
    )
    {
        super();
    }
}