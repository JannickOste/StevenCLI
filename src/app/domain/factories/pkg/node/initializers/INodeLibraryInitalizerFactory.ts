import NodeLibraryInitializer from "../../../../../infrastructure/services/pkg/node/NodeLibraryInitializer";
import ANodePackageConfiguration from "../../../../models/pkg/node/ANodePackageConfiguration";

export interface INodeLibraryInitializerFactory {
    create(configuration: ANodePackageConfiguration): Promise<NodeLibraryInitializer>;
}
