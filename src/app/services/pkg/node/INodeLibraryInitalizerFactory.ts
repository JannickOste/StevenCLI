import { INodePackageConfiguration } from "./NodeLibraryInitalizerFactory";
import NodeLibraryInitializer from "./NodeLibraryInitializer";

export interface INodeLibraryInitializerFactory {
    create(configuration: INodePackageConfiguration): Promise<NodeLibraryInitializer>;
}
