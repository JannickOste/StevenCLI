import * as fs from "fs";
import path from "path";
import CoreApplicationError from "../../core/domain/errors/CoreApplicationError";
import { IFileService } from "./IFileService";
import { injectable } from "inversify";

export type IOOptions = {
    recursive?: boolean,
    excludeExtensions?: string[],
    formatFilenameCallback?: (filename: string) => string
}

@injectable()
export default class FileService implements IFileService
{ 
    copyFiles(from: string, to: string, options?: IOOptions) {
        options ??= {};

        if(!fs.existsSync(from)) {
            throw new CoreApplicationError(`Filepath: ${from} not found`);
        }

        for(const dirent of fs.readdirSync(from, {withFileTypes: true})) {
            if(dirent.isDirectory()) {
                fs.mkdirSync(path.join(to, dirent.name), {recursive: true});
                if(options.recursive) {
                    this.copyFiles(path.join(from, dirent.name), path.join(to, dirent.name), options);
                }
            }

            if(dirent.isFile() && !(options.excludeExtensions ?? []).includes(path.extname(dirent.name))) {
                if(!fs.existsSync(to)) {
                    fs.mkdirSync(to, {recursive: true});
                }

                let filepath = path.join(to, options.formatFilenameCallback ? options.formatFilenameCallback(dirent.name) : dirent.name);
                fs.copyFileSync(
                    path.join(from, dirent.name), 
                    filepath
                );
            }
        }
    }
}
