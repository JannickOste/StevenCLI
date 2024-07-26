import { injectable } from "inversify";
import NPMFlags from "../../../../domain/services/pkg/node/npm/NPMFlags";
import { TSCFlags } from "../../../../domain/services/pkg/node/tsc/TSCFlags";
import ANodePackageConfiguration from "../../../../domain/models/pkg/node/ANodePackageConfiguration";
import INodePackageConfigurationBuilder from "../../../../domain/models/pkg/node/INodePackageConfigurationBuilder";
import { deepMerge } from "./deepMerge";

@injectable()
export default class ANodePackageConfigurationBuilder implements INodePackageConfigurationBuilder {
    private npmConfig: NPMFlags = {};
    private tscConfig: TSCFlags = {};

    setNPMConfig(config: NPMFlags): ANodePackageConfigurationBuilder {
        this.npmConfig = config;
        return this;
    }

    updateNPMConfig(config: NPMFlags): INodePackageConfigurationBuilder {
        this.npmConfig = deepMerge(this.npmConfig, config);
        return this;
    }

    setNPMConfigKey<K extends keyof NPMFlags>(option: K, value: NPMFlags[K]): INodePackageConfigurationBuilder {
        this.npmConfig[option] = value;
        return this;
    }

    setTSCConfig(config: TSCFlags): ANodePackageConfigurationBuilder {
        this.tscConfig = config;
        return this;
    }

    updateTSCConfig(config: TSCFlags): INodePackageConfigurationBuilder {
        this.tscConfig = deepMerge(this.tscConfig, config);
        return this;
    }

    getNPMConfigKey<K extends keyof NPMFlags>(option: K): NPMFlags[K] {
        return this.npmConfig[option];
    }

    setTSCConfigKey<K extends keyof TSCFlags>(option: K, value: TSCFlags[K]): INodePackageConfigurationBuilder {
        this.tscConfig[option] = value;
        return this;
    }

    getTSCConfigKey<K extends keyof TSCFlags>(option: K): TSCFlags[K] {
        return this.tscConfig[option];
    }

    build(): ANodePackageConfiguration {
        const builderInstance = this;
        const instance = new (class extends ANodePackageConfiguration {
            constructor() {
                super(builderInstance.npmConfig, builderInstance.tscConfig);
            }
        })();

        return instance;
    }
}
