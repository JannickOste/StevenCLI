import { inject } from "inversify";
import * as fs from "fs"
import path from "path";
import APP_TYPES from "../../../../../../APP_TYPES";
import IShellService from "../../../../../shell/IShellService";
import ANodeDependencyIntializer from "../ANodeDependencyIntializer";
import ANodePackageConfiguration from "../../../ANodePackageConfiguration";


export default class HuskyDependencyInitializer extends ANodeDependencyIntializer
{
    package_name: string = "husky"
    public package_type: "production" | "development" = "development"

    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {
        super();
    }

    async initialize(root: string, configuration: ANodePackageConfiguration) 
    { 
        console.log(`Running: npx husky init in ${root}`);
        await this.shellService.exec("npx husky init", { cwd: root });
        let script = "#!/bin/bash\n";

        if(configuration.hasDevDependency("jest", "ts-jest"))
        {
            script += "npm run test\n";
        }

        if(configuration.hasDevDependency("eslint"))
        {
            script += "npm run lint\n"
        }

        fs.writeFileSync(path.join(root, ".husky", "pre-commit"), script)
    }
}