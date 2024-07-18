export default {
    Services: {
        IShellService: Symbol.for("App::SERVICES::IShellService"),
        Pkg: {
            ITSCService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::ITSCService"),
            INPMService: Symbol.for("APP::SERVICES::PACKAGE_MANAGER::INPMService")
        }
    }
}