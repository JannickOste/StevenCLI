import { IOOptions } from "../../../infrastructure/services/io/IOOptions";

export interface IFileService {
    copyFiles(from: string, to: string, options?: IOOptions): void;
}
