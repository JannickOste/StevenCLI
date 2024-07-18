#!/usr/bin/env node

import AppStartup from "./app/AppStartup";
import IApplication from "./core/domain/IApplication";
import Application from "./app/Application";
import ApplicationBuilder from "./core/infrastructure/ApplicationBuilder";


(async() => {
    const application: IApplication = await (new ApplicationBuilder()
                            .setStartUp(AppStartup)
                            .build(Application));
    
    application.main();
})()