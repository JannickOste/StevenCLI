import 'reflect-metadata';
import { Container } from 'inversify';
import CommandSearchMapper from "../../../../../src/cli/infrastructure/mappers/CommandSearchMapper";
import ICommandService from '../../../../../src/cli/domain/services/ICommandService';
import TYPES from '../../../../../src/TYPES';
import ICommandSearch from '../../../../../src/cli/domain/models/commands/ICommandSearch';
import ICommand from '../../../../../src/cli/domain/models/commands/ICommand';
import CoreApplicationError from '../../../../../src/core/domain/errors/CoreApplicationError';
import { ICommandSearchMapper } from '../../../../../src/cli/domain/mappers/ICommandSearchMapper';
import getCommandInfo from '../../../../../src/cli/infrastructure/helpers/getCommandInfo';

// Mock the getCommandInfo function
jest.mock('../../../../../src/cli/infrastructure/helpers/getCommandInfo');

describe('CommandSearchMapper', () => {
  let commandSearchMapper: ICommandSearchMapper;
  let mockCommand: jest.Mocked<ICommand>;

  beforeEach(() => {
    const container = new Container();
    const mockCommandService = {} as unknown as ICommandService;

    container.bind<ICommandService>(TYPES.CLI.Services.ICommandService).toConstantValue(mockCommandService);
    commandSearchMapper = container.resolve(CommandSearchMapper);
    mockCommand = { invoke: jest.fn() } as jest.Mocked<ICommand>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapSearchToCommand', () => {
    it('should throw CoreApplicationError if commandInfo is not found', () => {
      (getCommandInfo as jest.Mock).mockReturnValue(null);

      const search: ICommandSearch = { name: 'test', args: [] };

      expect(() => commandSearchMapper.mapSearchToCommand(search, mockCommand)).toThrow(CoreApplicationError);
    });

    it('should add argument if last slice of search name does not match command name', () => {
      const commandInfo = {
        name: 'commandName',
        arguments: [{ prefix: '[arg]', default: 'default' }]
      };
      (getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

      const search: ICommandSearch = { name: 'test/command', args: [] };

      const result = commandSearchMapper.mapSearchToCommand(search, mockCommand);

      expect(result.args).toContainEqual({
        prefix: '[arg]',
        value: 'command',
        default: 'default'
      });
      expect(result.name).toBe('test');
    });

    it('should map arguments correctly', () => {
      const commandInfo = {
        name: 'commandName',
        arguments: [
          { prefix: '--arg1', default: 'default1' },
          { prefix: '--arg2', default: 'default2' }
        ]
      };
      (getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

      const search: ICommandSearch = {
        name: 'commandName',
        args: [{ prefix: '--arg1', value: 'value1' }]
      };

      const result = commandSearchMapper.mapSearchToCommand(search, mockCommand);

      expect(result.args).toEqual([
        { prefix: '--arg1', value: 'value1', default: 'default1' },
        { prefix: '--arg2', value: 'default2', default: 'default2' }
      ]);
    });

    it('should handle arguments with multiple prefixes', () => {
      const commandInfo = {
        name: 'commandName',
        arguments: [
          { prefix: '--arg1, -a', default: 'default1' },
          { prefix: '--arg2, -b', default: 'default2' }
        ]
      };
      (getCommandInfo as jest.Mock).mockReturnValue(commandInfo);

      const search: ICommandSearch = {
        name: 'commandName',
        args: [{ prefix: '-a', value: 'value1' }]
      };

      const result = commandSearchMapper.mapSearchToCommand(search, mockCommand);

      expect(result.args).toEqual([
        { prefix: '--arg1, -a', value: 'value1', default: 'default1' },
        { prefix: '--arg2, -b', value: 'default2', default: 'default2' }
      ]);
    });
  });
});
