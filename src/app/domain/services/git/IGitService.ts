export default interface IGitService {
    addFile(projectRoot: string, ... files: string[]): Promise<string | Buffer>;
    initializeRepo(projectRoot: string, defaultBranch?: string): Promise<string | Buffer>;
    commitMessage(projectRoot: string, message: string): Promise<string | Buffer>;
    addRemote(projectRoot: string, remoteName: string, repositoryUrl: string): Promise<string | Buffer>;
    pushToRemote(projectRoot: string, remote: string, branch: string): Promise<string | Buffer>;
    tagAndPush(projectRoot: string, remote: string, tag: string): Promise<string | Buffer>;
}
