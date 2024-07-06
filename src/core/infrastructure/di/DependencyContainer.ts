import { Container, injectable } from "inversify";
import TYPES from "../../../TYPES";
import "reflect-metadata"

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
    }
}

const container: Container = new DependencyContainer()

export default container;