import { injectable } from "inversify";
import ENV_CONFIG from "../../../ENV_CONFIG";
import ICommandTextService from "../../domain/services/ICommandTextService";

@injectable()
export default class CommandTextService implements ICommandTextService
{

    getCLIHeader(): string {
        return this.getTextBoxed(
            `${ENV_CONFIG.name} [Version: ${ENV_CONFIG.version}]`,
            ... ENV_CONFIG.description.length ? [
                '',
                `${(ENV_CONFIG.description.length ? ` ${ENV_CONFIG.description}` : "")}`
            ] : []
        )
    }

    getTextBoxed(...lines: string[]): string
    {
        const maxLength = Math.max(... lines.map(str => str.length));
        const divider = Array.from({length: maxLength}).fill("═").join("");

        const padLine = (line: string) => {
            const padding = Math.floor((maxLength - line.length) / 2);
            return ' '.repeat(padding) + line + ' '.repeat(maxLength - padding - line.length);
        };

        return `╔${divider}╗\n${lines.map(str => `║${padLine(str)}║`).join("\n")}\n╚${divider}╝`;
    }  
}