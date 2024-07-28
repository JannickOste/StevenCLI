import { User } from "../../domain/models/User";
import { inject, injectable } from "inversify";
import APP_TYPES from "../../APP_TYPES";
import UserRepository from "../repositories/UserRepository";

@injectable()
export default class UserService 
{
    constructor(
        @inject(APP_TYPES.repositories.IUserRepository) private readonly repository: UserRepository
    ) {
    }

    list(): Promise<User[]> 
    {
        return this.repository.list()
    }
}