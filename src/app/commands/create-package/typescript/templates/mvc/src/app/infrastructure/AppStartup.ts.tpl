import { Container, inject, injectable } from "inversify";
import TYPES from "../../TYPES";
import UserRepository from "./repositories/UserRepository";
import UserService from "./services/UserService";
import APP_TYPES from "../APP_TYPES";
import IStartup from "../../core/domain/IStartup";

@injectable()
export default class AppStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        // normally you make interfaces for these, but these are dummy files as showcase.
        this.container.bind<UserRepository>(APP_TYPES.repositories.IUserRepository).to(UserRepository)
        this.container.bind<UserService>(APP_TYPES.services.IUserService).to(UserService)
    }

    async configureServices(): Promise<void> {
    }
}