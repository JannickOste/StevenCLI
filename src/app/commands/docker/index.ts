import CommandDecorator from "../../../cli/domain/command/decorators/Command";
import ICommand from "../../../cli/domain/command/ICommand";

@CommandDecorator({
    name: "docker", 
    description: "Docker managemment commands",
    children: [
    ]
})
export default class DockerCommandGroup implements ICommand
{
    constructor(
    ) { 

    }
    
    invoke = () => {}
}