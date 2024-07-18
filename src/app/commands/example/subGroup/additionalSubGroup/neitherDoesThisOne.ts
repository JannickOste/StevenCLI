import CommandDecorator from "../../../../../cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../cli/domain/models/commands/ICommand";



@CommandDecorator({
    name: "command", 
    description: "some command example.",
    arguments: [
        {
            prefix: "*", 
            description: "some named test",
            required: true
        },
        {
            prefix: "--someTest",
            description: "sometest"
        }
    ]
})
export default class ExampleCommand implements ICommand
{
    invoke = (args: Record<string,unknown>) => console.dir(args)
}