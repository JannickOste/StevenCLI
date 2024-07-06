import { injectable } from "inversify";
import "reflect-metadata"
@injectable()
export default abstract class AAplicationEvent 
{
    public abstract invoke(...args: unknown[]): Promise<void>;
}