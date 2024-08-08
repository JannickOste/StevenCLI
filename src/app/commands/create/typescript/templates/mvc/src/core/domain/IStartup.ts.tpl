export default interface IStartup 
{ 
    registerServices(): Promise<void>;
    configureServices(): Promise<void>;
}
