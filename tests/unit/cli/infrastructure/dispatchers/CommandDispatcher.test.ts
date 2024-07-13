import "reflect-metadata";
import CommandDispatcher from "../../../../../src/cli/infrastructure/dispatchers/CommandDispatcher"
import EventManager from "../../../../../src/core/infrastructure/managers/EventManager";
import { ISearchCommandValidator } from "../../../../../src/cli/domain/validators/ISearchCommandValidator";
import ICommandSearch from "../../../../../src/cli/domain/models/commands/ICommandSearch";
import CommandErrorEvent from "../../../../../src/cli/infrastructure/events/CommandErrorEvent";
import ICommand from "../../../../../src/cli/domain/models/commands/ICommand";
import CommandInvokeEvent from "../../../../../src/cli/infrastructure/events/CommandInvokeEvent";
import ICommandTextService from "../../../../../src/cli/domain/services/ICommandTextService";
import CLIError from "../../../../../src/cli/domain/errors/CLIError";
import CommandNotFoundError from "../../../../../src/cli/domain/errors/CommandNotFoundError";


describe('CommandDispatcher', () => {
  let dispatcher: CommandDispatcher;
  let textService: jest.Mocked<ICommandTextService>;
  let validator: jest.Mocked<ISearchCommandValidator>;
  let eventManager: jest.Mocked<EventManager>;

  beforeEach(() => {
    textService = {getCLIHeader: jest.fn(), getTextBoxed: jest.fn()}
    validator = {validate: jest.fn()}
    eventManager = ( {
      emitSync: jest.fn(),
      emit: jest.fn()
    } as unknown) as jest.Mocked<EventManager>;

    dispatcher = new CommandDispatcher(
        eventManager, validator, textService
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("dispatch", () => {
    it('should emit CommandErrorEvent if validation fails', async () => {
        const errors = [new CLIError("some error")];
        validator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [] } as unknown as ICommandSearch;
    
        await dispatcher.dispatch(search);
    
        expect(eventManager.emitSync).toHaveBeenCalledWith(
          CommandErrorEvent,
          errors,
          search
        );
      });
    
      it('should emit CommandErrorEvent if commandModelType is undefined', async () => {
        const errors = [new CommandNotFoundError()];
        validator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [] } as unknown as ICommandSearch;
        await dispatcher.dispatch(search, undefined);
    
        expect(eventManager.emitSync).toHaveBeenCalledWith(
          CommandErrorEvent,
          errors,
          search
        );
      });
    
      it('should emit CommandInvokeEvent if validation passes', async () => {
        const errors: CLIError[] = [];
        validator.validate.mockResolvedValue(errors);
        
        const search: ICommandSearch = { args: [{ prefix: '--test', value: 'value', default: 'default' }] } as ICommandSearch;
        const commandModelType: ICommand = {} as ICommand;
    
        await dispatcher.dispatch(search, commandModelType);
    
        expect(eventManager.emitSync).toHaveBeenCalledWith(
          CommandInvokeEvent,
          commandModelType,
          { '--test': 'value' }
        );
      });
    
      it('should use default value if argument value is undefined', async () => {
        const errors: CLIError[] = [];
        validator.validate.mockResolvedValue(errors);
    
        const search: ICommandSearch = { args: [{ prefix: '--test', value: undefined, default: 'default' }] } as ICommandSearch;
        const commandModelType: ICommand = {} as ICommand;
    
        await dispatcher.dispatch(search, commandModelType);
    
        expect(eventManager.emitSync).toHaveBeenCalledWith(
          CommandInvokeEvent,
          commandModelType,
          { '--test': 'default' }
        );
      });
  })
});
