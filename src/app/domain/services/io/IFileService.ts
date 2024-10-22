import { IOOptions } from "../../models/io/IOOptions";

export interface IFileService {
    copyFiles(from: string, to: string, options?: IOOptions): void;
}
