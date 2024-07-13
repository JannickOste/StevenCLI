
import { injectable } from "inversify";
import "reflect-metadata";
import ICommandSearchParser from "../../domain/parsers/ICommandSearchParser";
import ICommandSearch from "../../domain/models/commands/ICommandSearch";
import ICommandArgument from "../../domain/models/commands/ICommandArgument";

@injectable()
export default class CommandSearchParser implements ICommandSearchParser 
{
    private readonly NAME_DELIMITER: string = "/";
    private readonly FLAG_PREFIX: string = "-"; 

    public parseFromProgramArguments(processArgv: string[]): ICommandSearch {
        const currentName = this.parseName(processArgv);
        const parsedArgs: ICommandArgument[] = this.parseArguments(
            currentName ? processArgv.slice(currentName.split(this.NAME_DELIMITER).length) : processArgv
        );

        return {
            name: currentName,
            args: parsedArgs
        };
    }

    private parseName(args: string[]): string {
        const nameParts = [];
        for (const arg of args) {
            if (arg.startsWith(this.FLAG_PREFIX)) break;
            nameParts.push(arg);
        }
        
        return nameParts.join(this.NAME_DELIMITER);
    }

    private parseArguments(args: string[]): ICommandArgument[] {
        const parsedArgs: ICommandArgument[] = [];
        let i = 0;
        let expectingValue = false;
    
        while (i < args.length) {
            const arg = args[i];
    
            if (arg.startsWith(this.FLAG_PREFIX)) {
                const prefix = arg;
                const nextArg = args[i + 1];
    
                if (nextArg && !nextArg.startsWith(this.FLAG_PREFIX)) {
                    parsedArgs.push({ prefix, value: nextArg });
                    i += 2; 
                } else {
                    parsedArgs.push({ prefix, value: true });
                    i += 1; 
                }
    
                expectingValue = false; 
            } else {
                if (expectingValue) {
                    parsedArgs.push({ prefix: "", value: arg });
                } else {
                    parsedArgs.push({ prefix: arg, value: true });
                    expectingValue = true; 
                }

                i += 1;
            }
        }
    
        return parsedArgs;
    }
    
}
