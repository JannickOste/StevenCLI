import { inject } from "inversify";
import path from "path";
import APP_TYPES from "../../../../../../APP_TYPES";
import IShellService from "../../../../../shell/IShellService";
import ANodeDependencyIntializer from "../ANodeDependencyIntializer";
import ANodePackageConfiguration from "../../../ANodePackageConfiguration";
import { IFileService } from "../../../../../IFileService";


export default class SemanticReleaseDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "@semantic-release/github"
    public package_type: "production" | "development" = "development"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService
    ) {
        super();
    }

    async initialize(root: string, configuration: ANodePackageConfiguration) 
    { 
        const missingDependencies = [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            "@semantic-release/github",
            "@semantic-release/git"
        ].filter((dependency) => !configuration.hasDevDependency(dependency))

        if(missingDependencies.length)
        {
            throw new Error(`Missing dev dependencies found (${missingDependencies.join(", ")})`)
        }

        this.fileService.copyFiles(
            path.join(__dirname, "template"),
            root, 
            {
                recursive: true, 
                formatFilenameCallback: (str) => str.replace(/(\.tpl)$/, "")
            }
        );
    }
}