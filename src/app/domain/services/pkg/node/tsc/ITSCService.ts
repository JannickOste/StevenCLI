import { TSCFlags } from "./TSCFlags";

export default interface ITSCService {
    initialize(root: string, options?: TSCFlags): Promise<void>;
    initializeGitignore(root: string): Promise<void>
    build(root: string, options?: TSCFlags): Promise<string | Buffer>;
}