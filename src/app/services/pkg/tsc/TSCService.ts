import { inject, injectable } from "inversify";
import { TSCFlags } from "./TSCFlags";
import APP_TYPES from "../../../APP_TYPES";
import IShellService from "../../shell/IShellService";
import ITSCService from "./ITSCService";

@injectable()
export default class TSCService implements ITSCService
{
    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {

    }

    private buildFlags(options: TSCFlags): string {
        const flags: string[] = [];

        for (const [key, value] of Object.entries(options)) {
            if (value === undefined) continue;

            switch (key) {
                case 'excludeDirectories':
                case 'excludeFiles':
                    flags.push(`--${key} ${Array.isArray(value) ? value.join(',') : value}`);
                    break;
                case 'fallbackPolling':
                case 'watchDirectory':
                case 'watchFile':
                case 'module':
                case 'moduleDetection':
                case 'moduleResolution':
                case 'newLine':
                case 'jsx':
                case 'target':
                    flags.push(`--${key} ${value}`);
                    break;
                case 'synchronousWatchDirectory':
                case 'watch':
                case 'declaration':
                case 'declarationMap':
                case 'diagnostics':
                case 'disableReferencedProjectLoad':
                case 'disableSizeLimit':
                case 'disableSolutionSearching':
                case 'disableSourceOfProjectReferenceRedirect':
                case 'downlevelIteration':
                case 'emitBOM':
                case 'emitDeclarationOnly':
                case 'emitDecoratorMetadata':
                case 'esModuleInterop':
                case 'exactOptionalPropertyTypes':
                case 'experimentalDecorators':
                case 'explainFiles':
                case 'extendedDiagnostics':
                case 'forceConsistentCasingInFileNames':
                case 'importHelpers':
                case 'inlineSourceMap':
                case 'inlineSources':
                case 'isolatedModules':
                case 'keyofStringsOnly':
                case 'listEmittedFiles':
                case 'listFiles':
                case 'noEmit':
                case 'noEmitHelpers':
                case 'noEmitOnError':
                case 'noErrorTruncation':
                case 'noFallthroughCasesInSwitch':
                case 'noImplicitAny':
                case 'noImplicitOverride':
                case 'noImplicitReturns':
                case 'noImplicitThis':
                case 'noImplicitUseStrict':
                case 'noLib':
                case 'noPropertyAccessFromIndexSignature':
                case 'noResolve':
                case 'noStrictGenericChecks':
                case 'noUncheckedIndexedAccess':
                case 'noUnusedLocals':
                case 'noUnusedParameters':
                case 'preserveConstEnums':
                case 'preserveSymlinks':
                case 'preserveValueImports':
                case 'preserveWatchOutput':
                case 'pretty':
                case 'removeComments':
                case 'resolveJsonModule':
                case 'resolvePackageJsonExports':
                case 'resolvePackageJsonImports':
                case 'skipDefaultLibCheck':
                case 'skipLibCheck':
                case 'sourceMap':
                case 'strict':
                case 'strictBindCallApply':
                case 'strictFunctionTypes':
                case 'strictNullChecks':
                case 'strictPropertyInitialization':
                case 'stripInternal':
                case 'suppressExcessPropertyErrors':
                case 'suppressImplicitAnyIndexErrors':
                case 'traceResolution':
                case 'useDefineForClassFields':
                case 'useUnknownInCatchVariables':
                case 'verbatimModuleSyntax':
                    if (value) {
                        flags.push(`--${key}`);
                    }
                    break;
                case 'baseUrl':
                case 'charset':
                case 'declarationDir':
                case 'generateCpuProfile':
                case 'mapRoot':
                case 'out':
                case 'outDir':
                case 'outFile':
                case 'paths':
                case 'jsxFactory':
                case 'jsxFragmentFactory':
                case 'jsxImportSource':
                case 'sourceRoot':
                case 'tsBuildInfoFile':
                case 'rootDir':
                case 'rootDirs':
                case 'typeRoots':
                case 'types':
                    flags.push(`--${key} ${Array.isArray(value) ? value.join(',') : value}`);
                    break;
                default:
                    console.warn(`Unknown flag: ${key}`);
            }
        }

        return flags.join(' ');
    }

    async initialize(root: string, options?: TSCFlags) {
        const flags = options ? this.buildFlags(options) : "";
        
        return await this.shellService.exec(`tsc --init ${flags}`, {cwd: root});
    }

    async build(root: string, options?: TSCFlags) {
        const flags = options ? this.buildFlags(options) : "";

        return await this.shellService.exec(`tsc ${flags}`, {cwd: root});
    }
}