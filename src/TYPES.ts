
export default {
    container: Symbol.for("CORE::Container"),
    Core: {
        IStartup: Symbol.for("CORE::IStartup"),
        Application: Symbol.for("CORE::Application")
    },
    CLI: {
        Parsers: {
            ICommandSearchParser: Symbol.for("CLI::PARSERS:ICommandSearchParser")
        },
        Loaders: {
            ICommandLoader:  Symbol.for("CLI::LOADERS:ICommandLoader")
        },
        ICommand: Symbol.for("CLI::ICommand")
    }
}