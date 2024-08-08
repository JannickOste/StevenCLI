import { Container, inject, injectable } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import TYPES from "../../../TYPES";
import * as express from "express"
import path = require("path");
import CONSTANTS from "../../../CONSTANTS";
import { globSync } from "glob";

export interface IExpressServer
{
    listen(port: number, callback?: () => void): Promise<unknown>
    initialize(): Promise<IExpressServer>
}

@injectable()
export default class ExpressServer implements IExpressServer
{
    private readonly express: InversifyExpressServer;
    private readonly controllerGlobPattern = path.join(CONSTANTS.ROOT, "**", "presentation", "controllers",  "*.{ts,js}").replace(/\\/g, '/');

    constructor(
        @inject(TYPES.container) container: Container
    ) {
        this.express = new InversifyExpressServer(container)

        this.express.setConfig((api: express.Application) => {
            api.use(express.urlencoded({
                extended: true
            }));
            
            api.use(express.json());
        });
    }

    async initialize() 
    {
        // InversifyExpress requires controllers to be imported to define metadata, fix for not having to type them all manually. 
        for(let dirent of globSync(this.controllerGlobPattern, {absolute: true}))
        {
            await import(dirent.toString())
        }

        return this;
    }

    async listen(port: number, callback?: () => void)
    {
        const app = this.express.build() as express.Application

        return app.listen(port, callback)
    }
}