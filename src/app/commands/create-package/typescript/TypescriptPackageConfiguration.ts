import ANodePackageConfiguration from "../../../domain/models/pkg/node/ANodePackageConfiguration";
import NPMFlags from "../../../domain/services/pkg/node/npm/NPMFlags";
import { TSCFlags } from "../../../domain/services/pkg/node/tsc/TSCFlags";

export default class TypescriptPackageConfiguration extends ANodePackageConfiguration 
{
    constructor()
    {
        const npmConfig: NPMFlags = {
            "init-version": "0.0.0",
            scripts: {
                "test": "jest --passWithNoTests",
                "publish": "tsc",
                "lint": "eslint ."
            },
            dependencies: [
                "reflect-metadata"
            ],
            devDependencies: [
                "@eslint/js@8.57.0",
                "eslint@8.57.0",
                "@semantic-release/changelog",
                "@semantic-release/commit-analyzer",
                "@semantic-release/git",
                "@semantic-release/github",
                "@semantic-release/release-notes-generator",
                "@types/ejs",
                "@types/inversify",
                "@types/jest",
                "@types/node",
                "husky",
                "jest",
                "ts-jest",
                "typescript",
                "typescript-eslint"
            ]
        }

        const tsConfig: TSCFlags =  {
            experimentalDecorators: true,
            strict: true,
            noImplicitAny: true,
            outDir: "./dist",
            rootDir: "./src"
        }

        super(
            npmConfig,
            tsConfig
        )
    }
}