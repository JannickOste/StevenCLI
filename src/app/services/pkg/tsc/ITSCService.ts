import { TSCFlags } from "./TSCFlags";

export default interface ITSCService {
    initialize(root: string, options?: TSCFlags): Promise<string | Buffer>;

    build(root: string, options?: TSCFlags): Promise<string | Buffer>;
}