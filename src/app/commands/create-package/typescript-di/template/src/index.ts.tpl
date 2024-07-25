#!/usr/bin/env node

import Application from "./app/infrastructure/Application";
import AppStartup from "./app/infrastructure/AppStartup";
import ApplicationBuilder from "./core/infrastructure/ApplicationBuilder";


(async() => {
    const application = await (new ApplicationBuilder()
                            .setStartUp(AppStartup)
                            .build(Application));
    
    application.main();
})()