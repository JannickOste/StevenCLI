import { injectable } from "inversify";
import { INodePackageConfiguration } from "../../NodeLibraryInitalizerFactory";

@injectable()
export default abstract class ANodeDependencyIntializer  
{
    public abstract package_name: string;
    public abstract package_type: "production" | "development"

    abstract initialize(root: string, configuration: INodePackageConfiguration): Promise<void>;

    //TODO: DUPLICATE FIX THIS BAD BAD BAD
    protected hasDependency(configuration: INodePackageConfiguration, ... options: string[]) 
    {
        return (configuration.npmConfig.dependencies ?? []).find(dependency => {
            return options.find((searchName) => dependency.startsWith(searchName)) !== undefined
        }) !== undefined;
    }

    protected hasDevDependency(configuration: INodePackageConfiguration, ... options: string[]) 
    {
        return (configuration.npmConfig.devDependencies ?? []).find(dependency => {
            return options.find((searchName) => dependency.startsWith(searchName)) !== undefined
        }) !== undefined;
    }

}