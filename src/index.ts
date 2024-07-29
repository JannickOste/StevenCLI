#!/usr/bin/env node

import Application from "./app/infrastructure/Application";
import AppStartup from "./app/infrastructure/AppStartup";
import IApplication from "./core/domain/IApplication";
import ApplicationBuilder from "./core/infrastructure/ApplicationBuilder";


(async() => {
    const application: IApplication = await (new ApplicationBuilder()
                            .setStartUp(AppStartup)
                            .build(Application));
    
    application.main();
})()