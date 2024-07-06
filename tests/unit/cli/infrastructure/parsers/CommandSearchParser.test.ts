import ICommandSearch from "../../../../../src/cli/domain/command/ICommandSearch";
import CommandSearchParser from  "../../../../../src/cli/infrastructure/parsers/CommandSearchParser"

describe('CommandSearchParser', () => {
    let parser: CommandSearchParser;

    beforeEach(() => {
        parser = new CommandSearchParser();
    });

    describe("parseFromProgramArguments", () => {
        test("should return an empty search object when no arguments are specified.", () => {
            const argv: string[] = [];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([]);
        });
    
        test("should parse single argument as name when it's not a flag", () => {
            const argv: string[] = ["groupName"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("groupName");
            expect(search.args).toEqual([]);
        });
    
        test("should parse multiple non-flag arguments as concatenated name", () => {
            const argv: string[] = ["nameFirst", "nameSecond"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("nameFirst/nameSecond");
            expect(search.args).toEqual([]);
        });
    
        test("should parse single flag argument as boolean", () => {
            const argv: string[] = ["--someFlag"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: true
                }
            ]);
        });    
        
        test("should parse single flag argument as boolean (single character)", () => {
            const argv: string[] = ["-someFlag"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([
                {
                    prefix: "-someFlag",
                    value: true
                }
            ]);
        });
    
        test("should parse flag with value correctly", () => {
            const argv: string[] = ["--someFlag", "someValue"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: "someValue"
                }
            ]);
        });
    
    
        test("should parse concatenated name with flags without value set", () => {
            const argv: string[] = ["nameFirst", "nameSecond", "--someFlag"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("nameFirst/nameSecond");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: true
                }
            ]);
        });
    
        test("should parse concatenated name with flags with value set", () => {
            const argv: string[] = ["nameFirst", "nameSecond", "--someFlag", "someValue"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("nameFirst/nameSecond");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: "someValue"
                }
            ]);
        });
    
        test("should parse flags before concatenated name and following non-flag argument", () => {
            const argv: string[] = ["--someFlag", "someValue", "something"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: "someValue"
                },
                {
                    prefix: "something",
                    value: true
                }
            ]);
        });
    
        test("should parse flags before concatenated name and subsequent flags with values", () => {
            const argv: string[] = ["--someFlag", "someValue", "something", "--someSecondFlag", "someSecondValue"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: "someValue"
                },
                {
                    prefix: "something",
                    value: true
                },
                {
                    prefix: "--someSecondFlag",
                    value: "someSecondValue"
                }
            ]);
        });
    
        test("should parse name and flags before concatenated name and subsequent flags with values", () => {
            const argv: string[] = ["some", "command", "--someFlag", "someValue", "something", "--someSecondFlag", "someSecondValue"];
            const search: ICommandSearch = parser.parseFromProgramArguments(argv);
    
            expect(search.name).toBe("some/command");
            expect(search.args).toEqual([
                {
                    prefix: "--someFlag",
                    value: "someValue"
                },
                {
                    prefix: "something",
                    value: true
                },
                {
                    prefix: "--someSecondFlag",
                    value: "someSecondValue"
                }
            ]);
        });
    })
});
