import CommandDecorator from "../../../../../cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../cli/domain/models/commands/ICommand";



@CommandDecorator({
    name: "command", 
    description: "some command example."
})
export default class ExampleCommand implements ICommand
{
    invoke = () => console.log("Ah you called me?")
}