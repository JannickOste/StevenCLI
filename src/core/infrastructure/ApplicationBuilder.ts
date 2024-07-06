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
            container.unbind(TYPES.Core.IAppStartup);
        }

        this.appStartupConstructor = startup;

        container.bind<IStartup>(TYPES.Core.IAppStartup).to(startup)

        return this;
    }

    async build(

    ): Promise<Application>
    {
        for(const startupType of [
            TYPES.Core.ICoreStartup, TYPES.Core.IAppStartup
        ]) {
            if(!container.isBound(startupType))
            {
                switch(startupType)
                {
                    case TYPES.Core.ICoreStartup: throw new Error("No core application startup bound");
                    default: continue;
                }
            }

            const startupInstance = container.get<IStartup>(startupType);
            await startupInstance.configureServices();
        }

        return container.resolve<Application>(Application)
    }
 }