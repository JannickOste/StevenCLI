import "reflect-metadata";
import { Container } from "inversify";
import CommandDispatcher from "../../../../../src/cli/infrastructure/dispatchers/CommandDispatcher"
import TYPES from "../../../../../src/TYPES";
import EventManager from "../../../../../src/core/infrastructure/managers/EventManager";
import { ISearchCommandValidator } from "../../../../../src/cli/domain/validators/ISearchCommandValidator";
import ICommandSearch from "../../../../../src/cli/domain/models/commands/ICommandSearch";
import CommandErrorEvent from "../../../../../src/cli/infrastructure/events/CommandErrorEvent";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import CommandInvokeEvent from "../../../../../src/cli/infrastructure/events/CommandInvokeEvent";

const mockEventManager = {
  emitSync: jest.fn()
};

const mockValidator = {
  validate: jest.fn()
};

describe('CommandDispatcher', () => {
  let dispatcher: CommandDispatcher;

  beforeEach(() => {
    const container = new Container();
    container.bind<EventManager>(TYPES.Core.Events.IEventManager).toConstantValue(mockEventManager as any);
    container.bind<ISearchCommandValidator>(TYPES.CLI.Validators.ISearchCommandValidator).toConstantValue(mockValidator as any);

    dispatcher = container.resolve(CommandDispatcher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("dispatch", () => {
    it('should emit CommandErrorEvent if validation fails', async () => {
        const errors = ['error1'];
        mockValidator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [] } as unknown as ICommandSearch;
    
        await dispatcher.dispatch(search);
    
        expect(mockEventManager.emitSync).toHaveBeenCalledWith(
          CommandErrorEvent,
          errors,
          search
        );
      });
    
      it('should emit CommandErrorEvent if commandModelType is undefined', async () => {
        const errors: string[] = [];
        mockValidator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [] } as unknown as ICommandSearch;
        await dispatcher.dispatch(search, undefined);
    
        expect(mockEventManager.emitSync).toHaveBeenCalledWith(
          CommandErrorEvent,
          errors,
          search
        );
      });
    
      it('should emit CommandInvokeEvent if validation passes', async () => {
        const errors: string[] = [];
        mockValidator.validate.mockResolvedValue(errors);
        
        const search: ICommandSearch = { args: [{ prefix: '--test', value: 'value', default: 'default' }] } as ICommandSearch;
        const commandModelType: ICommand = {} as ICommand;
    
        await dispatcher.dispatch(search, commandModelType);
    
        expect(mockEventManager.emitSync).toHaveBeenCalledWith(
          CommandInvokeEvent,
          commandModelType,
          { '--test': 'value' }
        );
      });
    
      it('should use default value if argument value is undefined', async () => {
        const errors: string[] = [];
        mockValidator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [{ prefix: '--test', value: undefined, default: 'default' }] } as ICommandSearch;
        const commandModelType: ICommand = {} as ICommand;
    
        await dispatcher.dispatch(search, commandModelType);
    
        expect(mockEventManager.emitSync).toHaveBeenCalledWith(
          CommandInvokeEvent,
          commandModelType,
          { '--test': 'default' }
        );
      });
  })
});
