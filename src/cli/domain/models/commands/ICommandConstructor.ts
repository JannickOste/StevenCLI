import ICommand from "./ICommand";

type ICommandConstructor = new(...args: any[]) => ICommand;

export default ICommandConstructor;