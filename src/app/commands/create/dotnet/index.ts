import { inject } from "inversify";
import { cwd } from "process";
import CommandDecorator from "../../../../cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../cli/domain/models/commands/ICommand";
import APP_TYPES from "../../../APP_TYPES";
import { IFileService } from "../../../domain/services/io/IFileService";
import IGitService from "../../../domain/services/git/IGitService";
import IShellService from "../../../domain/services/shell/IShellService";
import * as fs from "fs"
import path from "path";

const DOTNET_PACKAGE_NAME_PREFIX = "[package_name]";
const DOTNET_TEMPLATE_REPOSITORY_PREFIX = "-t, --template";
const DOTNET_LANGUAGE_PREFIX = "--lang";
const DOTNET_FRAMEWORK_PREFIX = "-f, --framework";
const DOTNET_GIT_REPOSITORY_PREFIX = "-r, --repo, --repository";
const DOTNET_SETUP_DEFAULT_PREFIX = "-y, --ignoreMissing";

@CommandDecorator({
    name: "dotnet",
    description: "Create a .NET project using the dotnet new command with specified templates and options.",
    arguments: [
        {
            prefix: DOTNET_PACKAGE_NAME_PREFIX,
            description: "The name of the .NET project/package",
            required: true
        },
        {
            prefix: DOTNET_SETUP_DEFAULT_PREFIX,
            description: "Ignore all unset parameters and assign defaults",
            default: false
        },
        {
            prefix: DOTNET_TEMPLATE_REPOSITORY_PREFIX,
            description: "The .NET template to use.",
            default: "console",
            options: [
                "console", "classlib", "wpf", "wpflib", "worker", "mstest",
                "nunit", "xunit", "razorclasslib", "webapi", "grpc", "sln",
                "mvc"
            ] 
        },
        {
            prefix: DOTNET_LANGUAGE_PREFIX,
            description: "The programming language to use with the template.",
            options: ["C#", "F#", "VB"],
            default: "C#"
        },
        {
            prefix: DOTNET_FRAMEWORK_PREFIX,
            description: "The target framework for the project.",
            default: "net7.0",
            options: ["net7.0", "net8.0"]
        },
        {
            prefix: DOTNET_GIT_REPOSITORY_PREFIX,
            description: "Repository where your project should be pushed to at the end of creation"
        }
    ]
})
export default class CreateDotnetPackageCommand implements ICommand 
{
    constructor(
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService,
        @inject(APP_TYPES.Services.Pkg.Git.IGitService) private readonly gitService: IGitService,
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
    ) {}

    private async createDotnetProject(template: string, projectName: string, options: { [key: string]: string }) {
        let command = `dotnet new ${template} -n ${projectName}`;

        if (options.language) command += ` --language "${options.language}"`;
        if (options.framework) command += ` --framework "${options.framework}"`;
        if (options.outputDirectory) command += ` --output "${options.outputDirectory}"`;

        if(fs.existsSync(path.join(cwd(), projectName)))
        {
            console.log(`Directory '${projectName}' already exists...`)
            return false;
        }

        try 
        {
            console.log(await this.shellService.exec(command, { cwd: cwd() }))
        } catch(e)
        {
            if((e as Error).message.includes("is not a valid value for --framework"))
            {
                if (/^net\d{1,2}\.\d{1,2}(\.\d{1,2})?$/.test(`${options.framework}`)) {
                    console.log("Im here")
                }
            }
        }

        return true;
    }

    private async initializeGitRepository(projectRoot: string, repositoryUrl: string) {
        if (repositoryUrl) {
            console.log("Initializing Git repository...");

            await this.gitService.initializeRepo(projectRoot);
            await this.gitService.addRemote(projectRoot, "origin", repositoryUrl);

            console.log(`Git repository initialized and remote set to '${repositoryUrl}'`);
        }
    }

    public async invoke(args: { [key: string]: unknown }) {
        try {
            const projectName = `${args[DOTNET_PACKAGE_NAME_PREFIX]}`;
            const template = `${args[DOTNET_TEMPLATE_REPOSITORY_PREFIX]}` || "console";
            const language = `${args[DOTNET_LANGUAGE_PREFIX]}` || "C#";
            const framework = `${args[DOTNET_FRAMEWORK_PREFIX]}` || "net7.0";

            if(await this.createDotnetProject(template, projectName, {
                language,
                framework
            }))
            { 
                console.log(`Created .NET project '${projectName}' using template '${template}'...`);
                const repositoryUrl = `${args[DOTNET_GIT_REPOSITORY_PREFIX]}` || "";
                await this.initializeGitRepository(path.join(cwd(), projectName), repositoryUrl);

                console.log("Project generated successfully!");
            } else console.log("Failed to generate project.")
        } catch (error) {
            console.error("An error occurred during project creation:", error);
        }
    }
}
