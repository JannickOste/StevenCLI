import { Container } from "inversify"
import ICommandRepository from "../../../../../src/cli/domain/repositories/ICommandRepository"
import InMemoryCommandRepository from "../../../../../src/cli/infrastructure/repositories/InMemmoryCommandRepository"
import TYPES from "../../../../../src/TYPES"
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand"
import CommandDecorator from "../../../../../src/cli/domain/models/commands/decorators/Command"; "../../../../../src/cli/domain/models/commands/decorators"

describe("InMemoryCommandRepository", () => {
    let container = new Container()
    let repository: ICommandRepository;
    beforeEach(() => {
        container.snapshot()

        repository = new InMemoryCommandRepository(
            container
        )
    })

    afterEach(() => {
        container.restore()
    })

    describe("getAll", () => {
        it("Should retrieve all commands assigned to TYPES.CLI.ICommand", async() => {
            @CommandDecorator({name: "hello world"})
            class DummyCommand implements ICommand { async invoke() {}} 

            container.bind<ICommand>(TYPES.CLI.ICommand).to(DummyCommand)

            expect(await repository.getAll()).toStrictEqual([new DummyCommand()])
        })
    })
})

