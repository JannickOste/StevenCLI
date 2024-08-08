import { Container, inject, injectable } from "inversify";
import TYPES from "../../TYPES";
import "reflect-metadata";
import IDatabase from "../domain/database/IDatabase";
import Database from "./database/Database";
import ExpressServer, { IExpressServer } from "./http/ExpressServer";
import IStartup from "../domain/IStartup";

@injectable()
export default class CoreStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
    }

    async registerServices(): Promise<void> {
        this.container.bind<IDatabase>(TYPES.Core.Database.IDatabase).to(Database).inSingletonScope()
        this.container.bind<IExpressServer>(TYPES.Core.Http.IExpressServer).to(ExpressServer).inSingletonScope()
    }

    async configureServices(): Promise<void> {
        await this.container.get<IDatabase>(TYPES.Core.Database.IDatabase).initialize();

        const express = this.container.get<IExpressServer>(TYPES.Core.Http.IExpressServer);

        await (await express.initialize()).listen(
            3000, 
            () => {console.log("API started ")}
        )
    }
}