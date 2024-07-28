export default {
    services: {
        IUserService: Symbol.for("APP::repositories::IUserService")

    },
    repositories: {
        IUserRepository: Symbol.for("APP::repositories::IUserRepository")
    }
}