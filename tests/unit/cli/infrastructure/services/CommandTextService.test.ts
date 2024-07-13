import 'reflect-metadata'; 
import CommandTextService from "../../../../../src/cli/infrastructure/services/CommandTextService";
import ENV_CONFIG from '../../../../../src/ENV_CONFIG';

jest.mock('../../../../../src/ENV_CONFIG', () => ({
  name: 'TestApp',
  version: '1.0.0',
  description: 'This is a test application description.'
}));

describe('CommandTextService', () => {
  let service: CommandTextService;

  beforeEach(() => {
    service = new CommandTextService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('getCLIHeader', () => {
    it('should return the correct CLI header string', () => {
      const expectedHeader = `
╔════════════════════════════════════════╗
║        TestApp [Version: 1.0.0]        ║
║                                        ║
║ This is a test application description.║
╚════════════════════════════════════════╝
`.trim();

      const result = service.getCLIHeader();

      expect(result).toBe(expectedHeader);
    });
  });

  describe('getTextBoxed', () => {
    it('should return a correctly formatted boxed text', () => {
      const lines = [
        'Hello',
        'World',
        'Test'
      ];

      const expectedBoxedText = `
╔═════╗
║Hello║
║World║
║Test ║
╚═════╝
`.trim();

      const result = service.getTextBoxed(...lines);

      expect(result).toBe(expectedBoxedText);
    });

    it('should handle a single line of text', () => {
      const lines = ['Single Line'];

      const expectedBoxedText = `
╔═══════════╗
║Single Line║
╚═══════════╝
`.trim();

      const result = service.getTextBoxed(...lines);

      expect(result).toBe(expectedBoxedText);
    });

    it('should handle multiple lines with varying lengths', () => {
      const lines = [
        'Short',
        'A bit longer line',
        'Longest line of all'
      ];

      const expectedBoxedText = `
╔═══════════════════╗
║       Short       ║
║ A bit longer line ║
║Longest line of all║
╚═══════════════════╝
`.trim();

      const result = service.getTextBoxed(...lines);

      expect(result).toBe(expectedBoxedText);
    });
  });
});
