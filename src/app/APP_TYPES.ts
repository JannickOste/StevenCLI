export default {
    Services: {
        IShellService: Symbol.for("App::SERVICES::IShellService"),
        Pkg: {
            Node: {
                IDependencyInitializers: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::NODE::DependencyInitializers"),
                ITSCService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::ITSCService"),
                INPMService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::INPMService"),
            },
            Git: {
                IGitService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::VERSION_MANAGER::IGitService"),
            }
        },
        File: {
            IFileService: Symbol.for('APP::SERVICES::FILE::IFileService')
        }
    },
    Factories: {
        Node:
        {
            INodeLibraryInitializerFactory: Symbol.for("APP::FACTORIES::NODE::NodeLibraryInitializer")
        }
    }
}