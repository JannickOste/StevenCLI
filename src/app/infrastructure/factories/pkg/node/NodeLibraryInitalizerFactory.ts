import { inject, injectable, multiInject } from "inversify";
import APP_TYPES from "../../../../APP_TYPES";
import ANodeDependencyIntializer from "../../../../domain/models/pkg/node/initializers/ANodeDependencyIntializer";
import IGitService from "../../../../domain/services/git/IGitService";
import INPMService from "../../../../domain/services/pkg/node/npm/INPMService";
import ITSCService from "../../../../domain/services/pkg/node/tsc/ITSCService";
import NodeLibraryInitalizer from "../../../services/pkg/node/NodeLibraryInitializer";
import IShellService from "../../../../domain/services/shell/IShellService";
import ANodePackageConfiguration from "../../../../domain/models/pkg/node/ANodePackageConfiguration";

@injectable()
export default class NodeLibraryInitalizerFactory
{
    constructor(
        @multiInject(APP_TYPES.Services.Pkg.Node.IDependencyInitializers) private readonly dependencyInitializers: ANodeDependencyIntializer[],
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService,
        @inject(APP_TYPES.Services.Pkg.Node.ITSCService) private readonly tscService: ITSCService,
        @inject(APP_TYPES.Services.Pkg.Node.INPMService) private readonly npmService: INPMService,
        @inject(APP_TYPES.Services.Pkg.Git.IGitService) private readonly gitService: IGitService
    ) {

    }
    
    public async create(
        configuration: ANodePackageConfiguration
    )
    {
        return new NodeLibraryInitalizer(
            configuration, 
            this.dependencyInitializers,
            this.gitService,
            this.shellService,
            this.tscService,
            this.npmService
        );
    }
}