import { inject } from "inversify";
import * as fs from "fs"
import path from "path";
import APP_TYPES from "../../../../../../../APP_TYPES";
import IShellService from "../../../../../../../domain/services/shell/IShellService";
import CoreApplicationError from "../../../../../../../../core/domain/errors/CoreApplicationError";
import { IFileService } from "../../../../../../../domain/services/io/IFileService";
import ANodeDependencyIntializer from "../../../../../../../domain/models/pkg/node/initializers/ANodeDependencyIntializer";
import ANodePackageConfiguration from "../../../../../../../domain/models/pkg/node/ANodePackageConfiguration";


export default class ESLintDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "eslint"
    public package_type: "production" | "development" = "development"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService
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

        this.fileService.copyFiles(
            configurationTemplateRoot, 
            root, 
            {
                recursive: true, 
                formatFilenameCallback: (str) => str.replace(/(\.tpl)$/, "")
            }
        );
    }
}