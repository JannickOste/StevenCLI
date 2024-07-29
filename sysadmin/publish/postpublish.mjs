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

const excludedExtensions = [
    // JavaScript and Related
    ".js",    // JavaScript file
    ".mjs",   // ECMAScript module file
    ".cjs",   // CommonJS module file
    ".jsx",   // JavaScript XML (React)
    ".json",  // JSON file (often used for configuration)
    ".coffee",// CoffeeScript file
    ".lit",   // LitElement file (a library for web components)

    // TypeScript
    ".ts",    // TypeScript file
    ".tsx",   // TypeScript XML (React)
    ".d.ts"   // TypeScript declaration file (for type definitions)
];

const transferFiles = (root, to) =>
{
    for(const dirent of fs.readdirSync(root, {withFileTypes: true}))
    {
        if(dirent.isDirectory())
        {
            transferFiles(path.join(root, dirent.name), path.join(to, dirent.name))
        }
        
        if(dirent.isFile() && !excludedExtensions.includes(path.extname(dirent.name)))
        {
            if(!fs.existsSync(to))
            {
                fs.mkdirSync(to, {recursive: true, force: true})
            }
            
            
            fs.copyFileSync(
                path.join(root, dirent.name), 
                path.join(to, dirent.name)
            )
        }
    }
}
const projectRoot = path.dirname(path.dirname(import.meta.dirname));

transferFiles(
    path.join(projectRoot, rootDir),
    path.join(projectRoot, outDir)
)