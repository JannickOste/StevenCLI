import * as readline from "readline";
import * as child_process from "child_process";
import { injectable } from "inversify";
import IShellService from "../../../domain/services/shell/IShellService";

@injectable()
export default class ShellService implements IShellService
{
    exec(command: string, options?: child_process.ExecOptions): Promise<string | Buffer> {    
        return new Promise((resolve, reject) => {
            child_process.exec(command, options, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(typeof stderr === "string" ? stderr : stderr.toString("utf-8")));
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    async exists(commandOrPath:string): Promise<boolean> 
    {
        try
        {
            const command = process.platform === 'win32' 
                                    ? `where ${commandOrPath}` 
                                    : `which ${commandOrPath}`;

            await this.exec(command, {windowsHide: true})
        } 
        catch(error)
        {
            return false; 
        }

        
        return true;
    }

    prompt(question: string): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve) => rl.question(question, (ans: string) => {
            rl.close();

            resolve(ans);
        }));
    }
}