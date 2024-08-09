import { inject } from "inversify";
import APP_TYPES from "../../../../../../../APP_TYPES";
import IShellService from "../../../../../../../domain/services/shell/IShellService";
import { IFileService } from "../../../../../../../domain/services/io/IFileService";
import ANodeDependencyIntializer from "../../../../../../../domain/models/pkg/node/initializers/ANodeDependencyIntializer";


export default class TailwindCSSDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "tailwindcss"
    public package_type: "production" | "development" = "production"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.File.IFileService) private readonly fileService: IFileService
    ) {
        super();
    }

    async initialize(root: string) 
    { 
        await this.shellService.exec("npx tailwindcss init", {cwd: root})
    }
}