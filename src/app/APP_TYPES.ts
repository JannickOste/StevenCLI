export default {
    Services: {
        IShellService: Symbol.for("App::SERVICES::IShellService"),
        Pkg: {
            ITSCService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::ITSCService"),
            INPMService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::INPMService"),
            Node: {
                IDependencyInitializers: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::NODE::DependencyInitializers"),
            },
            Git: {
                IGitService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::VERSION_MANAGER::IGitService"),
            }
        },

    },
    Factories: {
        Node:
        {
            INodeLibraryInitializerFactory: Symbol.for("APP::FACTORIES::NODE::NodeLibraryInitializer")
        }
    }
}