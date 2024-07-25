import * as child_process from "child_process"
export default interface IShellService 
{
    exec(command: string, options?: child_process.ExecOptions): Promise<string | Buffer>;
    exists(commandOrPath:string): Promise<boolean>;
    prompt(question: string): Promise<string>;
}