import NPMFlags from "../../../domain/services/pkg/node/npm/NPMFlags";
import { TSCFlags } from "../../../domain/services/pkg/node/tsc/TSCFlags";

const ProjectConfigurations: Record<string, {npmConfig: NPMFlags, tscConfig?: TSCFlags}> = {
    global: { // Applied to all configurations
        npmConfig: {
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
        },
        tscConfig: {
            strict: true,
            noImplicitAny: true,
            outDir: "./dist",
            rootDir: "./src"
        }
    },
    di: {
        npmConfig: {
            scripts: {
                "start": "tsc && node ./dist"
            },
            dependencies: [
                "inversify"
            ]
        },
        tscConfig: {
            experimentalDecorators: true
        }
    }
}

export default ProjectConfigurations;