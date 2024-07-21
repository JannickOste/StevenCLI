import * as fs from "fs"
import IShellService from "../../shell/IShellService";
import ITSCService from "./tsc/ITSCService";
import INPMService from "./npm/INPMService";
import ANodeDependencyIntializer from "./initializers/dependencies/ANodeDependencyIntializer";
import ANodePackageConfiguration from "./ANodePackageConfiguration";


export default class NodeLibraryInitalizer
{
    constructor(
        private readonly configuration: ANodePackageConfiguration,
        private readonly dependencyInitializers: ANodeDependencyIntializer[],
        private readonly shellService: IShellService,
        private readonly tscService: ITSCService,
        private readonly npmService: INPMService
    ) {

    }

    // TODO Add yarn switch between npm/yarn
    private async initializeConfiguration(
        projectRoot: string
    ) 
    {
        console.log("Initializing TypeScript configuration...");
        await this.tscService.initialize(projectRoot, this.configuration.tscConfig);
        await this.tscService.initializeGitignore(projectRoot)

        console.log("Initializing Node configuration...");
        await this.npmService.initialize(projectRoot, this.configuration.npmConfig);
    }

    private async initializeDependencies(
        projectRoot: string
    ) 
    {
        for(const initializer of this.dependencyInitializers)
        {
            let hasPackage: boolean = false; 
            switch(initializer.package_type)
            {
                case "production": hasPackage = this.configuration.hasDependency(initializer.package_name); break; 
                case "development": hasPackage = this.configuration.hasDevDependency(initializer.package_name); break; 
            }
            
            console.log(`${initializer.package_name}: ${hasPackage}`)
            if(hasPackage)
            {
                console.log(`Initializing node dependency: ${initializer.package_name}`)
                await initializer.initialize(projectRoot, this.configuration);
            }
        }
    }
    
    public async initialize(
        projectRoot: string, 
        projectName: string
    )
    {
        try 
        {
            if (fs.existsSync(projectRoot)) {
                console.error("Project root already exists...");
                return;
            }
    
            fs.mkdirSync(projectRoot);
            console.log(`Creating package ${projectName}...`);        
            await this.initializeConfiguration(projectRoot)

            console.log("Initializing git...");
            console.log((await this.shellService.exec(`git init && git branch -m main`, { cwd: projectRoot })).toString("utf8").trim());
            
            console.log("Initializing dependencies")
            await this.initializeDependencies(projectRoot)
            
            console.log(`Adding all structure files to git and adding default "Initial commit" message.`)
            console.log(await this.shellService.exec(`git add . && git commit -m "chore: Initial commit" -n`, { cwd: projectRoot }))

            // TODO: Move, cleanup, i don't know will see
            if (this.configuration.gitRepository && this.configuration.gitRepository.length) 
            {
                console.log("Adding repository URL as origin")
                await this.shellService.exec(`git remote add origin ${this.configuration.gitRepository}`, { cwd: projectRoot });

                if(this.configuration.hasDevDependency("@semantic-release"))
                {
                    console.log("Semantic release detected")
                    console.log("Tagging git to version 0.0.0 and pushing tag")
                    await this.shellService.exec(`git tag v0.0.0`, { cwd: projectRoot });
                    await this.shellService.exec(`git push origin v0.0.0`, { cwd: projectRoot });
                }

                console.log("Pushing HEAD to origin")
                console.log(await this.shellService.exec(`git push -u origin HEAD`, { cwd: projectRoot }));
            }
    
            console.log("Project generated successfully! Have fun coding :)");
    
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
}