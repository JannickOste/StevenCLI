import CommandCollection from "../../../../../src/cli/domain/models/commands/collections/CommandCollection";
import NamedCommandCollection from "../../../../../src/cli/domain/models/commands/collections/NamedCommandCollection";
import CommandDecorator from "../../../../../src/cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import ICommandService from "../../../../../src/cli/domain/services/ICommandService";
import CommandMapper from "../../../../../src/cli/infrastructure/mappers/CommandMapper"

describe('CommandMapper', () => {
  describe('collectionToNamedCollection', () => {
        it('should map a collection of commands to a named collection', () => {
            @CommandDecorator({name: "commandA"}) class CommandA implements ICommand {invoke() {}}
            @CommandDecorator({name: "commandB"}) class CommandB implements ICommand {invoke() {}}

            const commandCollection: CommandCollection = [new CommandA(), new CommandB()];
                const commandService: ICommandService = {
                    getCommandInfo: jest.fn()
                                    .mockReturnValueOnce({ name: 'commandA' })
                                    .mockReturnValueOnce({ name: 'commandB' }),
                    getAll: jest.fn(),
                    getCommandByName:jest.fn()
                }

                const mapper = new CommandMapper(commandService)
                const result: NamedCommandCollection = mapper.collectionToNamedCollection(commandCollection);

                const expected: NamedCommandCollection = {
                    commandA: new CommandA(),
                    commandB: new CommandB()
                };

                expect(result).toEqual(expected);
        });    
    });
});
