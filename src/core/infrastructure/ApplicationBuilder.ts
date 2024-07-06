import TYPES from "../../TYPES";
import IStartup from "../domain/IStartup";
import Application from "./Application";
import container from "./di/DependencyContainer";
 
 export default class ApplicationBuilder 
 { 
    
    private appStartupConstructor: (new() => IStartup) | undefined;

    setStartUp( 
        startup: new(...args: any[]) => IStartup
    ): ApplicationBuilder {
        if(this.appStartupConstructor !== undefined)
        {
            console.warn("Warning: Overiding previous application startup file.")
        }

        this.appStartupConstructor = startup;

        return this;
    }

    async build(

    ): Promise<Application>
    {
        if(this.appStartupConstructor)
        {
            container.bind<IStartup>(TYPES.Core.IStartup).to(this.appStartupConstructor)
        }

        const startupDependencies: IStartup[] = container.getAll<IStartup>(TYPES.Core.IStartup);
        for(const dependency of startupDependencies)
        {
            await dependency.registerServices()
        }

        for(const dependency of startupDependencies)
        {
            await dependency.configureServices()
        }

        return container.resolve<Application>(Application)
    }
 }