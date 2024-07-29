import { inject, injectable } from "inversify";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import APP_TYPES from "../../../../../APP_TYPES";
import IShellService from "../../../../../domain/services/shell/IShellService";
import NPMFlags from "../../../../../domain/services/pkg/node/npm/NPMFlags";

@injectable()
export default class NPMService 
{
    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {
        
    }

    private buildFlags(options: NPMFlags)
    {
        const flags = []
        for(const [key, value] of Object.entries(options))
        {
            switch(key)
            {
                case "init-author-name":
                case "init-author-url":
                case "init-license":
                case "init-module":
                case "init-version":
                case "scope":
                    flags.push(`--${key} ${value}`)
                    break;
                default: continue; 
            }
        }

        return flags.join(" ")
    }

    async initialize(
        root: string,
        options?: NPMFlags
    ) {
        const flags = options ? this.buildFlags(options) : ""

        await this.shellService.exec(
            `npm init ${flags} -y`,
            {cwd: root}
        )

        if(options?.scripts)
        {
            console.log("Injecting scripts into package.json")
            const packagePath = path.join(root, "package.json");
            const currentModule: unknown = JSON.parse(readFileSync(packagePath).toString("utf8"))
            if(currentModule && typeof currentModule === "object")
            {
                writeFileSync(packagePath, JSON.stringify({... currentModule, scripts: options?.scripts}, null, 4))
            }  
        }

        if(options?.dependencies)
        {
            console.log("Installing dependencies")
            await this.installDependency(root, ... options.dependencies)
        }

        if(options?.devDependencies)
        {
            console.log("Installing development dependencies")
            await this.installDevDependency(root, ... options.devDependencies)
        }
    }

    async installDependency(
        packageRoot: string,
        ... dependency: string[]
    ) {
        try 
        {
            await this.shellService.exec(`npm i ${dependency.join(" ")}`, {cwd: packageRoot})
        } catch(e)
        {
            return false;
        }

        return true;
    }

    async installDevDependency(
        packageRoot: string,
        ... dependency: string[]
    ) {
        try 
        {
            await this.shellService.exec(`npm i --save-dev ${dependency.join(" ")}`, {cwd: packageRoot})
        } catch(e)
        {
            return false;
        }

        return true;
    }  
    
    async uninstallDependency(
        packageRoot: string,
        ...dependency: string[]
    ) {
        try 
        {
            await this.shellService.exec(`npm uninstall ${dependency.join(" ")}`, {cwd: packageRoot});
        } catch(e)
        {
            return false;
        }

        return true;
    }

    async runScript(
        packageRoot: string,
        scriptName: string
    ) {
        try 
        {
            await this.shellService.exec(`npm run ${scriptName}`, {cwd: packageRoot});
        } catch(e)
        {
            return false;
        }

        return true;
    }
}