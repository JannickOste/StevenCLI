import { Container, injectable } from "inversify";
import TYPES from "../../../TYPES";
import "reflect-metadata"
import IStartup from "../../domain/IStartup";
import CoreStartup from "../CoreStartup";

@injectable()
class DependencyContainer extends Container
{
    constructor()
    {
        super();

        this.registerServices();
    }

    registerServices()
    {
        this.bind<Container>(TYPES.container).toConstantValue(this)

        this.bind<IStartup>(TYPES.Core.IStartup).to(CoreStartup)
    }
}

const container: Container = new DependencyContainer()

export default container;