import ANodePackageConfiguration from "./ANodePackageConfiguration";
import NodeLibraryInitializer from "./NodeLibraryInitializer";

export interface INodeLibraryInitializerFactory {
    create(configuration: ANodePackageConfiguration): Promise<NodeLibraryInitializer>;
}
