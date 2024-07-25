import { inject } from "inversify";
import * as fs from "fs"
import path from "path";
import APP_TYPES from "../../../../../../APP_TYPES";
import IShellService from "../../../../../shell/IShellService";
import ANodeDependencyIntializer from "../ANodeDependencyIntializer";
import CoreApplicationError from "../../../../../../../core/domain/errors/CoreApplicationError";
import ANodePackageConfiguration from "../../../ANodePackageConfiguration";


export default class ESLintDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "eslint"
    public package_type: "production" | "development" = "development"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {
        super();
    }

    async initialize(root: string, configuration: ANodePackageConfiguration) 
    { 
        const languageType = configuration.hasDevDependency("typescript-eslint") ? "typescript" : "javascript";
        const configurationTemplateRoot = path.join(__dirname, languageType);
        if(!fs.existsSync(configurationTemplateRoot))
        {
            throw new CoreApplicationError(`No configuration files found for linter with language: ${languageType}`)
        }

        this.copyFilesRecursive(configurationTemplateRoot, root)
    }
}