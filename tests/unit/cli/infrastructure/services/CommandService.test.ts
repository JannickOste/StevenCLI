import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import ICommandRepository from "../../../../../src/cli/domain/repositories/ICommandRepository";
import CommandService from "../../../../../src/cli/infrastructure/services/CommandService"
import CommandDecorator, { CommandMetadataKey } from "../../../../../src/cli/domain/models/commands/decorators/Command"; 

describe("CommandService", () => {
    const describeFunction = (key: keyof CommandService, descriptionCallback: jest.EmptyFunction) => describe(key, descriptionCallback);

    describeFunction("getAll", () => {
        it("It should be able to retrieve all command from repository", async() => {
            @CommandDecorator({name: "command_a"}) class CommandA implements ICommand { invoke() {}}
            const repository: ICommandRepository = { async getAll() { return  [new CommandA()]} }
            
            const service = new CommandService(repository, {collectionToNamedCollection: jest.fn()})

            const repoGetAllSpy = jest.spyOn(repository, "getAll")
            const result = await service.getAll();

            expect(result).toStrictEqual([new CommandA()])
            expect(repoGetAllSpy).toHaveBeenCalledTimes(1)
        })
        
        
        it("It should be able to ignore invalid command from repository", async() => {
            class CommandB {}
            class CommandA implements ICommand { invoke() {}}
            const repository: ICommandRepository = { async getAll() { return  [new CommandA(), new CommandB()] as any} }
            
            const service = new CommandService(repository, {collectionToNamedCollection: jest.fn()})

            const repoGetAllSpy = jest.spyOn(repository, "getAll")
            const result = await service.getAll();

            expect(result).toStrictEqual([])
            expect(repoGetAllSpy).toHaveBeenCalledTimes(1)
        })
        
    })

    describeFunction("getCommandByName", () => {
        it("It should be able to get a command by fully qualified name", async () => {
            @CommandDecorator({name: "command_a"}) class CommandA implements ICommand { invoke() {}}
            const repository: ICommandRepository = { async getAll() { return [new CommandA()]} }
            const service = new CommandService(repository, {collectionToNamedCollection: jest.fn().mockReturnValue({"command_a": new CommandA()})})
    
            const result = await service.getCommandByName("command_a")
    
            expect(result).toStrictEqual(new CommandA())
        })
    
        
        it("It should return undefined for non-existent commands", async () => {
            const repository: ICommandRepository = { async getAll() { return [] } }
            const service = new CommandService(repository, {collectionToNamedCollection: jest.fn().mockReturnValue({})})
    
            const result = await service.getCommandByName("non_existent_command")
    
            expect(result).toBeUndefined()
        })
    })    
})
