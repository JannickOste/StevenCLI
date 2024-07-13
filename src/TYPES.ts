
export default {
    container: Symbol.for("CORE::Container"),
    Core: {
        IStartup: Symbol.for("CORE::IStartup"),
        Application: Symbol.for("CORE::Application"),
        Events: { 
            IEvent: Symbol.for("CORE::EVENTS::IEvent"),
            IEventManager: Symbol.for("CORE::EVENTS::IEventManager")
        }
    },
    CLI: {
        Parsers: {
            ICommandSearchParser: Symbol.for("CLI::PARSERS:ICommandSearchParser")
        },
        Dispatchers: {
            ICommandDispatcher: Symbol.for("CLI::DISPATCHERS::ICommandDispatcher")
        },
        mappers: {
            ICommandMapper: Symbol.for("CLI::Mappers::ICommandMapper"),
            ICommandSearchMapper: Symbol.for("CLI::MAPPERS::ICommandSearchMapper")
        },
        Managers: {
            ICommandManager: Symbol.for("CLI::MANAGERS::ICommandManager")
        },
        Loaders: {
            ICommandLoader:  Symbol.for("CLI::LOADERS:ICommandLoader")
        },
        Repositories: { 
            ICommandRepository: Symbol.for("CLI::Repositories::CommandRepository")
        },
        Services: {
            ICommandService: Symbol.for("CLI::Services::ICommandService")
        },
        Validators: {
            ISearchCommandValidator: Symbol.for("CLI::VALIDATORS::ISearchCommandValidator")
        },
        Constants: {
            COMMAND_ROOT: Symbol.for("CLI::CONSTANT->Command_root_directory")
        },
        ICommand: Symbol.for("CLI::ICommand"),
    }
}