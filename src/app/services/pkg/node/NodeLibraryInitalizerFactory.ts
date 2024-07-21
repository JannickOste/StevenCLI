import IShellService from "../../shell/IShellService";
import ITSCService from "./tsc/ITSCService";
import INPMService from "./npm/INPMService";
import { TSCFlags } from "./tsc/TSCFlags";
import NPMFlags from "./npm/NPMFlags";
import { inject, injectable, multiInject } from "inversify";
import APP_TYPES from "../../../APP_TYPES";
import NodeLibraryInitalizer from "./NodeLibraryInitializer";
import ANodeDependencyIntializer from "./initializers/dependencies/ANodeDependencyIntializer";

export interface INodePackageConfiguration {
    tscConfig: TSCFlags; 
    npmConfig: NPMFlags;
}

@injectable()
export default class NodeLibraryInitalizerFactory
{
    constructor(
        @multiInject(APP_TYPES.Services.Pkg.Node.IDependencyInitializers) private readonly dependencyInitializers: ANodeDependencyIntializer[],
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.Pkg.ITSCService) private readonly tscService: ITSCService,
        @inject(APP_TYPES.Services.Pkg.INPMService) private readonly npmService: INPMService
    ) {

    }
    
    public async create(
        configuration: INodePackageConfiguration
    )
    {
        return new NodeLibraryInitalizer(
            configuration, 
            this.dependencyInitializers,
            this.shellService,
            this.tscService,
            this.npmService
        );
    }
}