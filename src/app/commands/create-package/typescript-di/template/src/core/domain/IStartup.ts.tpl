interface IStartup 
{ 
    registerServices(): Promise<void>;
    configureServices(): Promise<void>;
}

export default IStartup;