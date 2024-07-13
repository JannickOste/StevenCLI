import CommandCollection from "../../../../../src/cli/domain/models/commands/collections/CommandCollection";
import NamedCommandCollection from "../../../../../src/cli/domain/models/commands/collections/NamedCommandCollection";
import CommandDecorator from "../../../../../src/cli/domain/models/commands/decorators/Command";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import CommandMapper from "../../../../../src/cli/infrastructure/mappers/CommandMapper";
import getCommandInfo from "../../../../../src/cli/infrastructure/helpers/getCommandInfo";
import ICommandMapper from "../../../../../src/cli/domain/mappers/ICommandMapper";

// Mock the getCommandInfo function
jest.mock('../../../../../src/cli/infrastructure/helpers/getCommandInfo');

describe('CommandMapper', () => {
    let command: jest.Mocked<ICommand>;
    let mapper: ICommandMapper;

    beforeEach(() => {
        command = {invoke: jest.fn()} 
        mapper = new CommandMapper();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

  describe('collectionToNamedCollection', () => {
    it('should map a collection of commands to a named collection', () => {
        (getCommandInfo as jest.Mock)
        .mockReturnValueOnce({ name: 'commandA' })
        .mockReturnValueOnce({ name: 'commandB' });

      const result: NamedCommandCollection = mapper.collectionToNamedCollection([command, command]);

      const expected: NamedCommandCollection = {
        commandA: command,
        commandB: command
      };

      expect(result).toEqual(expected);
    });
  });
});
