import { IOOptions } from "./FileService";

export interface IFileService {
    copyFiles(from: string, to: string, options?: IOOptions): void;
}
