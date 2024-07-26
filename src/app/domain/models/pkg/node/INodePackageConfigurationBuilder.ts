import NPMFlags from "../../../services/pkg/node/npm/NPMFlags";
import { TSCFlags } from "../../../services/pkg/node/tsc/TSCFlags";
import ANodePackageConfiguration from "./ANodePackageConfiguration";

export default interface INodePackageConfigurationBuilder {
    setNPMConfig(config: NPMFlags): INodePackageConfigurationBuilder;
    updateNPMConfig(config: NPMFlags): INodePackageConfigurationBuilder;
    setNPMConfigKey<K extends keyof NPMFlags>(option: K, value: NPMFlags[K]): INodePackageConfigurationBuilder;
    getNPMConfigKey<K extends keyof NPMFlags>(option: K): NPMFlags[K];
    setTSCConfig(config: TSCFlags): INodePackageConfigurationBuilder;
    updateTSCConfig(config: TSCFlags): INodePackageConfigurationBuilder;
    setTSCConfigKey<K extends keyof TSCFlags>(option: K, value: TSCFlags[K]): INodePackageConfigurationBuilder;
    getTSCConfigKey<K extends keyof TSCFlags>(option: K): TSCFlags[K];
    build(): ANodePackageConfiguration;
}
