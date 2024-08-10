import { inject } from "inversify";
import APP_TYPES from "../../../../../../../APP_TYPES";
import IShellService from "../../../../../../../domain/services/shell/IShellService";
import { IFileService } from "../../../../../../../domain/services/io/IFileService";
import ANodeDependencyIntializer from "../../../../../../../domain/models/pkg/node/initializers/ANodeDependencyIntializer";
import ANodePackageConfiguration from "../../../../../../../domain/models/pkg/node/ANodePackageConfiguration";
import * as fs from "fs"
import path from "path";

export default class PostCSSDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "postcss"
    public package_type: "production" | "development" = "production"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService
    ) {
        super();
    }

    async initialize(root: string, configuration: ANodePackageConfiguration)
    { 
        const supportedDependencies = [
            "tailwindcss", 
            "autoprefixer",
            "cssnano",
            "postcss-import",
            "postcss-nested"
        ]

        const payload: string = `module.exports = {
            plugins: [
                ${
                    supportedDependencies
                        .filter(dependency => configuration.hasDependency(dependency) || configuration.hasDevDependency(dependency))
                        .map(dependency => `require('${dependency}')`)
                        .join(",")
                }
            ],
        };`
        
        fs.writeFileSync(
            path.join(root, "postcss.config.js"),
            payload
        )
    }
}