export default interface ICommandManager {
    invokeWithArgv(argv: string[]): Promise<void>;
}
