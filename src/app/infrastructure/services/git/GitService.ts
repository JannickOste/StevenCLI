import { inject, injectable } from "inversify";
import IGitService from "../../../domain/services/git/IGitService";
import APP_TYPES from "../../../APP_TYPES";
import IShellService from "../../../domain/services/shell/IShellService";
import CoreApplicationError from "../../../../core/domain/errors/CoreApplicationError";

@injectable()
export class GitService implements IGitService {
    constructor(
        @inject(APP_TYPES.Services.IShellService) private readonly shellService: IShellService
    ) {}


    public async initializeRepo(projectRoot: string, defaultBranch: string = `main`) {
        return (await this.shellService.exec(`git init && git branch -m ${defaultBranch}`, { cwd: projectRoot })).toString("utf8").trim()
    }

    public async addFile(projectRoot: string, ... files: string[])
    {
        if(!files.length)
        {
            throw new CoreApplicationError("No files provided to add to git repository.")
        }

        return await this.shellService.exec(`git add ${files.join(" ")}`, { cwd: projectRoot });
    }

    public async commitMessage(projectRoot: string, message: string) {
        await this.addFile(projectRoot, ".")

        return await this.shellService.exec(`git commit -m "${message}"`, { cwd: projectRoot });
    }

    public async addRemote(projectRoot: string, remoteName: string, repositoryUrl: string) {
        return await this.shellService.exec(`git remote add ${remoteName} ${repositoryUrl}`, { cwd: projectRoot });
    }

    public async pushToRemote(projectRoot: string, remote: string, branch: string) {
        return await this.shellService.exec(`git push ${remote} ${branch}`, { cwd: projectRoot });
    }

    public async tagAndPush(projectRoot: string, remote: string, tag: string) {
        await this.shellService.exec(`git tag ${tag}`, { cwd: projectRoot });
        return await this.shellService.exec(`git push ${remote} ${tag}`, { cwd: projectRoot });
    }
}
