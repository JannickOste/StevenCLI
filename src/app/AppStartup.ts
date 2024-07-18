import { Container, inject, injectable } from "inversify";
import IStartup from "../core/domain/IStartup";
import TYPES from "../TYPES";
import "reflect-metadata"
import IShellService from "./services/shell/IShellService";
import APP_TYPES from "./APP_TYPES";
import ShellService from "./services/shell/shellService";

@injectable()
export default class AppStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {

        
    }

    async registerServices(): Promise<void> {
        this.container.bind<IShellService>(APP_TYPES.Services.IShellService).to(ShellService)
    }

    async configureServices(): Promise<void> {

    }
}