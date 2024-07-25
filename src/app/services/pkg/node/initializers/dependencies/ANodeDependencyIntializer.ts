import { injectable } from "inversify";
import ANodePackageConfiguration from "../../ANodePackageConfiguration";
import * as fs from "fs"
import path from "path";

@injectable()
export default abstract class ANodeDependencyIntializer  
{
    public abstract package_name: string;
    public abstract package_type: "production" | "development"

    abstract initialize(root: string, configuration: ANodePackageConfiguration): Promise<void>;

    
    copyFilesRecursive(
        root: string,
        to: string, 
        excludeExtensions: string[] = [], 
        formatFilenameCallback: (str: string) => string = (str) => str.replace(/(\.tpl)$/, "")
    ) {
        for(const dirent of fs.readdirSync(root, {withFileTypes: true}))
        {
            if(dirent.isDirectory())
            {
                this.copyFilesRecursive(path.join(root, dirent.name), path.join(to, dirent.name))
            }

            if(dirent.isFile() && !excludeExtensions.includes(path.extname(dirent.name)))
            {
                if(!fs.existsSync(to))
                {
                    fs.mkdirSync(to, {recursive: true})
                }

                fs.copyFileSync(
                    path.join(root, dirent.name), 
                    path.join(to, formatFilenameCallback(dirent.name))
                )
            }
        }
    }

}