import * as fs from "fs"
import path from "path"

const error = (str) => {
    console.error(str)
    process.exit(-1)
}

const {compilerOptions} = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
if(!compilerOptions)
{
    error("Failed to get tsconfig.json")
}

const requiredKeys = ["rootDir", "outDir"]
for(const key of requiredKeys)
{
    if(!compilerOptions[key])
    {
        error(`Required key ${key} not found in tsconfig.json`)
    } 
}

const {rootDir, outDir} = compilerOptions;
const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if(!packageInfo)
{
    error("Failed to read package.json.")
}

const { name, version, description, author} = packageInfo;
const escapedProjectRoot = path.dirname(path.dirname(import.meta.dirname)).replace(/\\/g, '\\\\');
console.log("Dumping package information")
fs.writeFileSync(
    path.join(rootDir, 'ENV_CONFIG.ts'),
    `//DO NOT WRITE ANYTHING IN THIS FILE, THIS FILE WILL BE OVERIDDEN ON PUBLISH
export interface IENV_CONFIG { name: string, version: string, description:string, author: string, projectRoot:string, sourceDir: string, buildDir: string}
const ENV_CONFIG: IENV_CONFIG = {name: "${name}", version: "${version}", description: "${description}", author: "${author}", projectRoot: "${escapedProjectRoot}", sourceDir: "${rootDir}", buildDir: "${outDir}"}
export default ENV_CONFIG; 
`
)
