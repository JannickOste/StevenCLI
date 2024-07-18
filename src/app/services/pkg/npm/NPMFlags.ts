
type NPMFlags = {
    "init-author-name"?: string,
    "init-author-url"?: string,
    "init-license"?: string,
    "init-module"?: string,
    "init-version"?: string,
    "scope"?: string,
    scripts: {[key: string]: string}
}

export default NPMFlags;