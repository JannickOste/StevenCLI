
export default {
    container: Symbol.for("CORE::Container"),
    Core: {
        Database: {
            IDatabase: Symbol.for("CORE::DATABASE::IDatabase")
        },
        Http: {
            IExpressServer: Symbol.for("CORE::HTTP::IExpressServer")
        },
        IStartup: Symbol.for("CORE::IStartup"),
        Application: Symbol.for("CORE::Application")
    }
}