# Steven

## Overview

Steven is designed to help you build powerful command-line interfaces (CLI) with ease. You can define commands, group them, and the framework will handle parsing, dispatching, and executing them based on user input.

## Getting Started

### Installation

To install the CLI application globally, you can use the provided installation script:

1. Run the installation script:

   ```bash
   ./install.sh
   ```

2. This will make the CLI tool available globally. You can now use the command `steven` from anywhere in your terminal.

### Usage

After installation, you can run the CLI tool using the command `steven`. Here are some common usage examples:

- **Display Help**: To view all available commands and their descriptions, use:

  ```bash
  steven --help
  ```

- **Run a Command**: To execute a specific command, simply type:

  ```bash
  steven <command> [options]
  ```

### Uninstallation

To remove the CLI tool from your system, you can use the provided uninstallation script:

1. Run the uninstallation script:

   ```bash
   ./uninstall.sh
   ```

2. This will remove the global installation, and the `steven` command will no longer be available.

### Creating a com,mand

To define commands for your CLI application, place your command classes in the `src/app/commands` directory. The framework will automatically detect and register these commands.

1. **Command Group**: Commands can be organized into groups and sub-groups. Here's how to set up a command group and its sub-commands:

   - **Command Group File** (`src/app/commands/COMMAND_NAME/index.ts`):

     ```typescript
     import { CommandDecorator } from 'path-to-decorators';
     import { EventManager } from 'path-to-event-manager';
     import { ICommand, ICommandConstructor } from 'path-to-interfaces';
     import { CommandHelpEvent } from 'path-to-events';

     @CommandDecorator({
         name: "group",
         description: "Some command group example.",
         children: [
             ExampleSubCommandGroup
         ]
     })
     export default class ExampleCommandGroup implements ICommand
     {
         constructor(
             @inject(TYPES.Core.Events.IEventManager) private readonly eventManager: EventManager
         ) { }

         invoke = () => this.eventManager.emitSync(
             CommandHelpEvent,
             this.constructor as ICommandConstructor
         )
     }
     ```

   - **Sub-command File** (`src/app/commands/COMMAND_NAME/SOME_FOLDER/index.ts`):

     ```typescript
     import { CommandDecorator } from 'path-to-decorators';
     import { ICommand } from 'path-to-interfaces';

     @CommandDecorator({
         name: "command",
         description: "Some command example."
     })
     export default class ExampleCommand implements ICommand
     {
         invoke = () => console.log("Ah you called me?")
     }
     ```

### How It Works

- **Command Registration**: Place your command classes in the `src/app/commands` directory. The framework will automatically find and register these commands.

- **Command Invocation**: When you run your CLI, the framework parses the input arguments, identifies the appropriate command, and invokes it. For commands that belong to a group, it will navigate through the hierarchy based on the input.

- **Events and Output**: Commands can emit events and handle outputs as defined in their `invoke` methods. For example, a command can display help information or perform specific actions.

### Additional Information

- **Event Management**: The framework supports event-driven actions. You can emit events and handle them to perform complex tasks or provide interactive feedback.

- **Configuration**: Customize your CLI application through configuration files and dependency injection. This allows for flexible and modular development.

## Contributing

If you want to contribute to the CLI Framework, please follow these steps:

1. **Fork** the repository.
2. **Create** a feature branch.
3. **Commit** your changes.
4. **Submit** a pull request.

## License

This CLI Framework is licensed under the [MIT License](LICENSE).

## Contact

For support or questions, please reach out to Oste Jannick at [jannick@oste.dev].