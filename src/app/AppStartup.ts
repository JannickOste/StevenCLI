import { Container, inject, injectable } from "inversify";
import IStartup from "../core/domain/IStartup";
import TYPES from "../TYPES";
import "reflect-metadata"
import IShellService from "./services/shell/IShellService";
import APP_TYPES from "./APP_TYPES";
import ShellService from "./services/shell/ShellService";
import ITSCService from "./services/pkg/tsc/ITSCService";
import TSCService from "./services/pkg/tsc/TSCService";
import INPMService from "./services/pkg/npm/INPMService";
import NPMService from "./services/pkg/npm/NPMService";

@injectable()
export default class AppStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        this.container.bind<IShellService>(APP_TYPES.Services.IShellService).to(ShellService)
        this.container.bind<ITSCService>(APP_TYPES.Services.Pkg.ITSCService).to(TSCService)
        this.container.bind<INPMService>(APP_TYPES.Services.Pkg.INPMService).to(NPMService)
    }

    async configureServices(): Promise<void> {

    }
}