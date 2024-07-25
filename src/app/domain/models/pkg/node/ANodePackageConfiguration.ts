import NPMFlags from "../../../services/pkg/node/npm/NPMFlags";
import { TSCFlags } from "../../../services/pkg/node/tsc/TSCFlags";

export default abstract class ANodePackageConfiguration 
{
    gitRepository?: string;

    constructor(
        public readonly npmConfig: NPMFlags,
        public readonly tscConfig?: TSCFlags
    ) {

    }
    
    public hasDependency(... options: string[]) 
    {
        return (this.npmConfig.dependencies ?? []).find(dependency => {
            return options.find((searchName) => dependency.startsWith(searchName)) !== undefined
        }) !== undefined;
    }

    public hasDevDependency(... options: string[]) 
    {
        return (this.npmConfig.devDependencies ?? []).find(dependency => {
            return options.find((searchName) => dependency.startsWith(searchName)) !== undefined
        }) !== undefined;
    }
}
