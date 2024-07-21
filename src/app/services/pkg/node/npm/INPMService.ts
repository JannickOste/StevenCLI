import NPMFlags from "./NPMFlags";

export default interface INPMService {
    initialize(root: string, options?: NPMFlags): Promise<void>;
    installDependency(packageRoot: string, ...dependency: string[]): Promise<boolean>;
    installDevDependency(packageRoot: string, ...dependency: string[]): Promise<boolean>;
    uninstallDependency(packageRoot: string, ...dependency: string[]): Promise<boolean>;
    runScript(packageRoot: string, scriptName: string): Promise<boolean>;
}
