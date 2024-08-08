import { Repository } from "typeorm";
import { inject, injectable } from "inversify";
import TYPES from "../../../TYPES";
import IDatabase from "../../../core/domain/database/IDatabase";
import { User } from "../../domain/models/User";

@injectable()
export default class UserRepository
{
    private userRepository: Repository<User>;

    constructor(
        @inject(TYPES.Core.Database.IDatabase) private readonly database: IDatabase
    ) {
        this.userRepository = this.database.manager.getRepository(User);
    }

    async list(): Promise<User[]> {
        return this.userRepository.find();
    }
}