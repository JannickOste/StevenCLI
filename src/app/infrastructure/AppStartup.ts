import { Container, inject, injectable } from "inversify";
import IStartup from "../../core/domain/IStartup";
import TYPES from "../../TYPES";
import "reflect-metadata"
import IShellService from "../domain/services/shell/IShellService";
import APP_TYPES from "../APP_TYPES";
import ShellService from "./services/shell/ShellService";
import TSCService from "./services/pkg/node/tsc/TSCService";
import INPMService from "../domain/services/pkg/node/npm/INPMService";
import NPMService from "./services/pkg/node/npm/NPMService";
import HuskyDependencyInitializer from "./services/pkg/node/initializers/dependencies/husky/HuskyDependencyIntializer";
import ESLintDependencyInitializer from "./services/pkg/node/initializers/dependencies/eslint/ESLintDependencyInitializer";
import IGitService from "../domain/services/git/IGitService";
import { GitService } from "./services/git/GitService";
import SemanticReleaseDependencyInitializer from "./services/pkg/node/initializers/dependencies/semantic-release_github/SemanticReleaseDependencyInitializer";
import { IFileService } from "../domain/services/io/IFileService";
import ITSCService from "../domain/services/pkg/node/tsc/ITSCService";
import { INodeLibraryInitializerFactory } from "../domain/factories/pkg/node/initializers/INodeLibraryInitalizerFactory";
import ANodeDependencyIntializer from "../domain/models/pkg/node/initializers/ANodeDependencyIntializer";
import FileService from "./services/io/FileService";
import NodeLibraryInitalizerFactory from "./factories/pkg/node/NodeLibraryInitalizerFactory";

@injectable()
export default class AppStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        this.container.bind<IShellService>(APP_TYPES.Services.IShellService).to(ShellService)
        this.container.bind<ITSCService>(APP_TYPES.Services.Pkg.Node.ITSCService).to(TSCService)
        this.container.bind<INPMService>(APP_TYPES.Services.Pkg.Node.INPMService).to(NPMService)
        this.container.bind<IGitService>(APP_TYPES.Services.Pkg.Git.IGitService).to(GitService)
        this.container.bind<IFileService>(APP_TYPES.Services.File.IFileService).to(FileService)

        this.container.bind<INodeLibraryInitializerFactory>(APP_TYPES.Factories.Node.INodeLibraryInitializerFactory).to(NodeLibraryInitalizerFactory)
        this.container.bind<ANodeDependencyIntializer>(APP_TYPES.Services.Pkg.Node.IDependencyInitializers).to(HuskyDependencyInitializer)
        this.container.bind<ANodeDependencyIntializer>(APP_TYPES.Services.Pkg.Node.IDependencyInitializers).to(ESLintDependencyInitializer)
        this.container.bind<ANodeDependencyIntializer>(APP_TYPES.Services.Pkg.Node.IDependencyInitializers).to(SemanticReleaseDependencyInitializer)
    }

    async configureServices(): Promise<void> {
    }
}