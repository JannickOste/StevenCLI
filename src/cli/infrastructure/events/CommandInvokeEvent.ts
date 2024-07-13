import { injectable } from "inversify";
import AAplicationEvent from "../../../core/domain/events/AAplicationEvent";
import ICommand from "../../domain/models/commands/ICommand";


@injectable()
export default class CommandInvokeEvent extends AAplicationEvent
{
    public async invoke(
        commandModelType: ICommand, 
        payload: {[key: string]: unknown}
    ) {
        try 
        {
            await commandModelType.invoke(
                payload ?? []
            );
        } catch(e)
        {
            console.log("An error occured when attempting invoke the command")
            console.dir(e)
        }
    }
}