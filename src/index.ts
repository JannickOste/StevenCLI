import AppStartup from "./app/AppStartup";
import Application from "./core/infrastructure/Application";
import ApplicationBuilder from "./core/infrastructure/ApplicationBuilder";


(async() => {
    const application: Application = await (new ApplicationBuilder()
                            .setStartUp(AppStartup)
                            .build());
    
    application.main();
})()