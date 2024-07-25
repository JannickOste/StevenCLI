
import { inject } from "inversify";
import path from "path";
import { cwd } from "process";
import CommandDecorator from "../../../../cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../cli/domain/models/commands/ICommand";
import APP_TYPES from "../../../APP_TYPES";
import IShellService from "../../../services/shell/IShellService";
import { INodeLibraryInitializerFactory } from "../../../services/pkg/node/INodeLibraryInitalizerFactory";
import * as fs from "fs"
import ANodePackageConfiguration from "../../../services/pkg/node/ANodePackageConfiguration";
import TypescriptPackageConfiguration from "./TypescriptPackageConfiguration";

const TYPESCRIPT_PACKAGE_NAME_PREFIX = "[package_name]"
const TYPESCRIPT_GIT_REPOSITORY_PREFIX = "-r, --repo, --repository"
const TYPESCRIPT_SETUP_DEFAULT_PREFIX = "-y, --ignoreMissing"

@CommandDecorator({
    name: "typescript",
    description: "Create a typescript package enviroment with semantic-release workflows for github",
    arguments: [
        {
            prefix: TYPESCRIPT_PACKAGE_NAME_PREFIX,
            description: "The name of the typescript package",
            required: true
        },
        {
            prefix: TYPESCRIPT_SETUP_DEFAULT_PREFIX,
            description: "Ignore all unset parameters and assign defaults",
            required: false,
            default: false
        },
        {
            prefix: TYPESCRIPT_GIT_REPOSITORY_PREFIX,
            description: "Repository where you package should be pushed to at end of creation",
            required: false,
            default: ""
        }
    ]
})
export default class CreateTypescriptPackageCommand implements ICommand 
{
    private readonly configuration: ANodePackageConfiguration;

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Factories.Node.INodeLibraryInitializerFactory) private readonly packageInitializerFactory: INodeLibraryInitializerFactory
    ) {
        this.configuration = new TypescriptPackageConfiguration();
    }

    public async invoke(args: { [key: string]: unknown }) {
        this.configuration.gitRepository = `${args[TYPESCRIPT_GIT_REPOSITORY_PREFIX]}`
        const libraryInitializer = await this.packageInitializerFactory.create(this.configuration);
        const projectRoot = path.join(cwd(), `${args[TYPESCRIPT_PACKAGE_NAME_PREFIX]}`);

        try {
            await libraryInitializer.initialize(projectRoot, `${args[TYPESCRIPT_PACKAGE_NAME_PREFIX]}`);
        } catch (error) {
            console.error("An error occurred during initialization:", error);
            
            if (fs.existsSync(projectRoot)) {
                try {
                    fs.rmSync(projectRoot, { recursive: true, force: true });
                    console.log(`Removed project directory: ${projectRoot}`);
                } catch (cleanupError) {
                    console.error(`Failed to remove project directory: ${projectRoot}`, cleanupError);
                }
            }
        }
    }
}