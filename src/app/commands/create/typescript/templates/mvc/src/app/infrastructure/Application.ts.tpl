import { inject, injectable } from "inversify"
import "reflect-metadata"
import IApplication from "../../core/domain/IApplication"
import { User } from "../domain/models/User"
import TYPES from "../../TYPES"
import IDatabase from "../../core/domain/database/IDatabase"

@injectable()
export default class Application implements IApplication
{
    constructor(
        @inject(TYPES.Core.Database.IDatabase) private readonly database: IDatabase
    ) {

    }

    public async main(): Promise<void> 
    {
        const user: User = new User()
        user.firstName = "Timber"
        user.lastName = "Saw"
        user.age = 25
        await this.database.manager.getRepository<User>(User).save(user)
    }
}