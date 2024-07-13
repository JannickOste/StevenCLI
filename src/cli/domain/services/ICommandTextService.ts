
export default interface ICommandTextService {
    getCLIHeader(): string;
    getTextBoxed(...lines: string[]): string;
}
