import { injectable } from "inversify";
import ANodePackageConfiguration from "../ANodePackageConfiguration";

@injectable()
export default abstract class ANodeDependencyIntializer  
{
    public abstract package_name: string;
    public abstract package_type: "production" | "development"

    abstract initialize(root: string, configuration: ANodePackageConfiguration): Promise<void>;
}