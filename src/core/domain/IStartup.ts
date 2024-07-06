export default interface IStartup 
{ 
    configureServices(): Promise<void>;
}
