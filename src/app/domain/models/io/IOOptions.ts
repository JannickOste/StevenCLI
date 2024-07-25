
export type IOOptions = {
    recursive?: boolean;
    excludeExtensions?: string[];
    formatFilenameCallback?: (filename: string) => string;
};
