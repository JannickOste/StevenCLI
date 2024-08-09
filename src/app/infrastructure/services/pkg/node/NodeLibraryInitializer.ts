import * as fs from "fs"
import IShellService from "../../../../domain/services/shell/IShellService";
import INPMService from "../../../../domain/services/pkg/node/npm/INPMService";
import IGitService from "../../../../domain/services/git/IGitService";
import ANodeDependencyIntializer from "../../../../domain/models/pkg/node/initializers/ANodeDependencyIntializer";
import ITSCService from "../../../../domain/services/pkg/node/tsc/ITSCService";
import ANodePackageConfiguration from "../../../../domain/models/pkg/node/ANodePackageConfiguration";


export default class NodeLibraryInitalizer
{
    constructor(
        private readonly configuration: ANodePackageConfiguration,
        private readonly dependencyInitializers: ANodeDependencyIntializer[],
        private readonly gitService: IGitService,
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
            
            if(hasPackage)
            {
                console.log(`Initializing node dependency: ${initializer.package_name}`)
                await initializer.initialize(projectRoot, this.configuration);
            }
        }
    }
    
    public async initialize(
        projectRoot: string, 
        projectName: string,
        allowExistingPath: boolean
    )
    {
        try 
        {
            if (fs.existsSync(projectRoot)) {
                if(!allowExistingPath)
                {
                    console.error("Project root already exists...");
                    return;
                }
            } else fs.mkdirSync(projectRoot);

            console.log(`Creating package ${projectName}...`);        
            await this.initializeConfiguration(projectRoot)

            console.log("Initializing dependencies")
            await this.initializeDependencies(projectRoot)

            if (this.configuration.gitRepository && this.configuration.gitRepository.length) 
            {
                console.log("Initializing git...");
                console.log(await this.gitService.initializeRepo(projectRoot))
                
                console.log(`Adding all structure files to git and adding default "Initial commit" message.`)
                console.log(await this.gitService.addFile(projectRoot, "."))
                console.log(await this.gitService.commitMessage(projectRoot, "chore: Initial commit"))

                
                console.log("Adding repository URL as origin")
                console.log(await this.gitService.addRemote(projectRoot, "origin", this.configuration.gitRepository))

                // TODO: Move, cleanup, i don't know will see
                if(this.configuration.hasDevDependency("@semantic-release"))
                {
                    console.log("Semantic release detected")
                    console.log("Tagging git to version 0.0.0 and pushing tag")
                    console.log(await this.gitService.tagAndPush(projectRoot, "origin", "v0.0.0"))
                }

                console.log("Pushing HEAD to origin")
                console.log(await this.gitService.pushToRemote(projectRoot, "origin", 'HEAD'))
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
}