
export default {
    container: Symbol.for("CORE::Container"),
    Core: {
        ICoreStartup: Symbol.for("CORE::IStartup_CORE"),
        IAppStartup: Symbol.for("CORE::IStartup_APP"),
        Application: Symbol.for("CORE::Application")
    },
    CLI: {
        Parsers: {
            ICommandSearchParser: Symbol.for("CLI::PARSERS:ICommandSearchParser")
        }
    }
}