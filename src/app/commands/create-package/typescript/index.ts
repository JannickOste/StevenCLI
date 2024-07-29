
import { inject } from "inversify";
import path from "path";
import { cwd } from "process";
import CommandDecorator from "../../../../cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../cli/domain/models/commands/ICommand";
import APP_TYPES from "../../../APP_TYPES";
import * as fs from "fs"
import { INodeLibraryInitializerFactory } from "../../../domain/factories/pkg/node/initializers/INodeLibraryInitalizerFactory";
import INodePackageConfigurationBuilder from "../../../domain/models/pkg/node/INodePackageConfigurationBuilder";
import { IFileService } from "../../../domain/services/io/IFileService";
import TemplateConfigurations from "./TemplateConfigurations"

const TYPESCRIPT_PACKAGE_NAME_PREFIX = "[package_name]"
const TYPESCRIPT_TEMPLATE_REPOSITORY_PREFIX = "-t, --template"
const TYPESCRIPT_GIT_REPOSITORY_PREFIX = "-r, --repo, --repository"
const TYPESCRIPT_SETUP_DEFAULT_PREFIX = "-y, --ignoreMissing"

const templateRoot = path.join(__dirname, "templates");
const templateNames = fs.readdirSync(templateRoot, {withFileTypes: true}).filter(v => v.isDirectory()).map(v => v.name);

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
            prefix: TYPESCRIPT_TEMPLATE_REPOSITORY_PREFIX,
            description: "The typescript source template to use.",
            required: false,
            default: "plain",
            options: templateNames
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
    constructor(
        @inject(APP_TYPES.Factories.Node.INodeLibraryInitializerFactory) private readonly packageInitializerFactory: INodeLibraryInitializerFactory,
        @inject(APP_TYPES.Builders.Node.ANodePackageConfigurationBuilder) private readonly configurationBuilder: INodePackageConfigurationBuilder,
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService
    ) {
    }

    private buildConfiguration(template: string)
    {
        this.configurationBuilder
            .setNPMConfig( TemplateConfigurations.global.npmConfig)
            .setTSCConfig(TemplateConfigurations.global.tscConfig ?? {})

        if(template in TemplateConfigurations)
        {
            this.configurationBuilder
                    .updateNPMConfig(TemplateConfigurations[template]?.npmConfig ?? {})
                    .updateTSCConfig(TemplateConfigurations[template]?.tscConfig ?? {})
        }

        return this.configurationBuilder.build();
    }

    public async invoke(args: { [key: string]: unknown }) {
        const currentTemplateRoot = path.join(templateRoot, `${args[TYPESCRIPT_TEMPLATE_REPOSITORY_PREFIX]}`)

        if(!fs.existsSync(currentTemplateRoot))
        {
            return console.error(`Template '${args[TYPESCRIPT_TEMPLATE_REPOSITORY_PREFIX]}' not found, available options: ${templateNames.join(", ")}`)
        }

        const configuration = this.buildConfiguration(`${args[TYPESCRIPT_TEMPLATE_REPOSITORY_PREFIX]}`)
        configuration.gitRepository = `${args[TYPESCRIPT_GIT_REPOSITORY_PREFIX]}`

        const libraryInitializer = await this.packageInitializerFactory.create(configuration);
        const projectRoot = path.join(cwd(), `${args[TYPESCRIPT_PACKAGE_NAME_PREFIX]}`);


        console.log("Transfering source structure from template")
        this.fileService.copyFiles(
            currentTemplateRoot, 
            projectRoot, {
                recursive: true, 
                formatFilenameCallback: (str) => str.replace(/(\.tpl)$/, "")
            }
        )

        try {
            await libraryInitializer.initialize(projectRoot, `${args[TYPESCRIPT_PACKAGE_NAME_PREFIX]}`, true);
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

        return console.log("Project generated!")
    }
}