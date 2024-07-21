import { inject } from "inversify";
import { INodePackageConfiguration } from "../../../NodeLibraryInitalizerFactory";
import * as fs from "fs"
import path from "path";
import APP_TYPES from "../../../../../../APP_TYPES";
import IShellService from "../../../../../shell/IShellService";
import ANodeDependencyIntializer from "../ANodeDependencyIntializer";
import CoreApplicationError from "../../../../../../../core/domain/errors/CoreApplicationError";


export default class ESLintDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "eslint"
    public package_type: "production" | "development" = "development"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {
        super();
    }

    transferConfigurationFiles(root: string, to: string)
    {
        for(const dirent of fs.readdirSync(root, {withFileTypes: true}))
        {
            if(dirent.isDirectory())
            {
                this.transferConfigurationFiles(path.join(root, dirent.name), path.join(to, dirent.name))
            }
            if(dirent.isFile())
            {
                fs.copyFileSync(
                    path.join(root, dirent.name), 
                    path.join(to, dirent.name.replace(/(\.tpl)$/, ""))
                )
            }
        }
    }

    async initialize(root: string, configuration: INodePackageConfiguration) 
    { 
        const languageType = this.hasDevDependency(configuration, "typescript-eslint") ? "typescript" : "javascript";
        const configurationTemplateRoot = path.join(__dirname, languageType);
        if(!fs.existsSync(configurationTemplateRoot))
        {
            throw new CoreApplicationError(`No configuration files found for linter with language: ${languageType}`)
        }

        this.transferConfigurationFiles(configurationTemplateRoot, root)
    }
}