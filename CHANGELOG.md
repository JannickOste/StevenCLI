# [0.6.0](https://github.com/JannickOste/StevenCLI/compare/v0.5.0...v0.6.0) (2024-07-29)


### Bug Fixes

* ApplicationBuilder test fixed pre refactor ([4229c0f](https://github.com/JannickOste/StevenCLI/commit/4229c0f862e9227a9558f709ca148954e8e2b02c))
* check added for template in typescript create package command ([640072b](https://github.com/JannickOste/StevenCLI/commit/640072b99bc059b904677e1d76dc726b5bfdb9f2))
* commandHelpEvent visually improved, code is terrible, needs some serious fixing ([f604daa](https://github.com/JannickOste/StevenCLI/commit/f604daa412c37541aab3498e3288b66603e114bc))
* linter rule for no dupe class members disabled,  required for overloads in mvc proxy ([c2a28a9](https://github.com/JannickOste/StevenCLI/commit/c2a28a96f56fc002238a3f1f803cc296230400d3))
* node flags moved to propper folder and di added for initializers and factory ([6cd298d](https://github.com/JannickOste/StevenCLI/commit/6cd298d3d31c440095ce00a4afbe9f1651146a3c))
* removed commandvaluetype from commandinfo for linter ([a8d83f6](https://github.com/JannickOste/StevenCLI/commit/a8d83f6761a30d4e320376e14cbfa1663e1e185d))
* removed folder with git folder inside ([a8525f1](https://github.com/JannickOste/StevenCLI/commit/a8525f1ae4123daa7708155fcbd8b679a699cbcc))
* template move is before node library initialization now, adds files to git as it should ([9c6a7d0](https://github.com/JannickOste/StevenCLI/commit/9c6a7d085d034cd3e2727d91fa65446342cc8315))
* **TSCService:** check added for barrel files ([d874e19](https://github.com/JannickOste/StevenCLI/commit/d874e193846de55ddb5ef0e25888ebf1d5c2e1c4))
* **TSCService:** check added for barrel files ([8b03f4a](https://github.com/JannickOste/StevenCLI/commit/8b03f4a8e52e4dbb10fd1ea6543bdb3c53b34ef5))


### Features

* **ANodeDependencyInitializer:** abstract base added for multi inject in node initializer ([7d23f33](https://github.com/JannickOste/StevenCLI/commit/7d23f33fa4e24370f7a17390f5708dbe68670e9b))
* **ANodePackageConfigurationBuilder:** configuration builder added with merge helper for configuration updates ([26e825a](https://github.com/JannickOste/StevenCLI/commit/26e825ae0bb3340c7b4f1b7285182d205b6bdc6a))
* **Command::TypescriptDI:** project generator command for typescript with inversify dependency injection added ([da10e09](https://github.com/JannickOste/StevenCLI/commit/da10e094d7dac1572de647bd81e2f209c4c6ec69))
* **Command::Typescript:** typescript project generation command added ([4a5b22e](https://github.com/JannickOste/StevenCLI/commit/4a5b22ebe9585e139388a20d232fdacc95750c67))
* CommandInfo value type, extracted to type for later use ([566cae5](https://github.com/JannickOste/StevenCLI/commit/566cae59addc82a7a2cec4aad6037122712f7168))
* create package typescript mvc template added ([47dbbb4](https://github.com/JannickOste/StevenCLI/commit/47dbbb40495a3cc1c5f7ebf319814f928e07e08a))
* **ESLintDependencyInitializer:** dependency initializer for typescript eslint, other languages still unsupported ([9d4c463](https://github.com/JannickOste/StevenCLI/commit/9d4c463d012d142748e2d08b212f6ebefdbfd073))
* **FileService:** file service added, only has copy functionality atm ([d264481](https://github.com/JannickOste/StevenCLI/commit/d264481b8b0667c1b493c463bf8c2dfe7880d77d))
* **GitService:** basic service added for git requests ([ab224e5](https://github.com/JannickOste/StevenCLI/commit/ab224e5021ab3932e75b8538521f0e3de3e80d34))
* **HuskyDependencyInitializer:** added to setup pre-commit hooks ([24d4ba7](https://github.com/JannickOste/StevenCLI/commit/24d4ba71a4ba2d27e3bdb74345a71fbaadb35f65))
* linter added to pre-commit ([207c21a](https://github.com/JannickOste/StevenCLI/commit/207c21a5668ff15d2d45b09c74735d6382425170))
* **NodeLibraryInitalizer:** generalized installer added for NPM/TSC packages, yarn still unsupported ([349ed2f](https://github.com/JannickOste/StevenCLI/commit/349ed2f550478dcb652254a0a6b5f87e14c002e6))
* **NodeLibraryInitializerFactory:** factory added to produce initializers with proper configuration ([d77b408](https://github.com/JannickOste/StevenCLI/commit/d77b4080061c0de16f9149c1eae0c4dc32d02f6e))
* **NPMService:** service added for simple javascript package managment ([aca67c3](https://github.com/JannickOste/StevenCLI/commit/aca67c3338326c6a2d7cb8a2b97b7b27f77c33e6))
* options added for templates, pre-release ([25c7f33](https://github.com/JannickOste/StevenCLI/commit/25c7f3356d6911e915dfc7b0af70592319a0543c))
* options added to command arguments for clearer instructions ([d5e0342](https://github.com/JannickOste/StevenCLI/commit/d5e03427854befc8bee01573154bb0eaa5f655fe))
* options check added to searchcommand validator ([9d12f4a](https://github.com/JannickOste/StevenCLI/commit/9d12f4a40b315ac281eac46326adf2a2d8df510e))
* postpublish script added to allow for template transfer between source and build directory ([f864f00](https://github.com/JannickOste/StevenCLI/commit/f864f0085ac36ebb0b7b062f31d5a8b0a72f9d54))
* **SemanticReleaseDependencyInitializer:** Semantic release initializer for github extension added ([1f08888](https://github.com/JannickOste/StevenCLI/commit/1f08888d2d91da906aa73a3dd1a8daa874fa481c))
* **ShellService:** for command execution and CLI interaction added ([1c43fac](https://github.com/JannickOste/StevenCLI/commit/1c43fac2707172b3d1110af2becd02fddb9d1de0))
* start script added to typescript di template ([81d8457](https://github.com/JannickOste/StevenCLI/commit/81d8457a956c3b155fc58d1de3969d59f3996f71))
* **TSCService:** service base added for typescript initialization / compiling ([1f99a03](https://github.com/JannickOste/StevenCLI/commit/1f99a03ffce65927bf60605d014bb4619e94c91a))
* typescript command reworked, uses configuration builder now ([be15c23](https://github.com/JannickOste/StevenCLI/commit/be15c2321c25a925f10d8ff58466da5f34f306fd))


### Performance Improvements

* ANodeDepenencyInitializer copy removed and replaced with file service copy ([2d80575](https://github.com/JannickOste/StevenCLI/commit/2d8057584f8055b338e99b74ec484fddacbe5866))
* **Command::Typescript:** inversify removed from clean typescript source ([07b78fb](https://github.com/JannickOste/StevenCLI/commit/07b78fb13f1c396ad8b3c48313d21f8477b0e93d))
* **example:** example command removed, will change this to an external repository ([2d060b9](https://github.com/JannickOste/StevenCLI/commit/2d060b9e7711543fc42a711393a2869a6b5003c7))

# [0.5.0](https://github.com/JannickOste/StevenCLI/compare/v0.4.0...v0.5.0) (2024-07-18)


### Bug Fixes

* application coupling removed from app builder ([6502203](https://github.com/JannickOste/StevenCLI/commit/65022035c65d7890eb00a111dd4e55a10f396f10))
* SubCommandItemNotFound added, forgotton in previous push ([55ebebd](https://github.com/JannickOste/StevenCLI/commit/55ebebdb0bcd090b26aaa6ee8b7cef448a1ba83c))
* tests updated towards new behaviour of parser ([807d6a1](https://github.com/JannickOste/StevenCLI/commit/807d6a19932f33f186e6fde36bb4fd8764199c5a))


### Features

* **SearchCommandMapper:** support added for named and itterable suffix arguments ([c9ab548](https://github.com/JannickOste/StevenCLI/commit/c9ab548af5f805583117604c58e020b4f34a4696))

# [0.4.0](https://github.com/JannickOste/StevenCLI/compare/v0.3.0...v0.4.0) (2024-07-14)


### Features

* (un)installer added ([9ce9d1c](https://github.com/JannickOste/StevenCLI/commit/9ce9d1cf9bd890e9f840864d1f99487087638186))

# [0.3.0](https://github.com/JannickOste/StevenCLI/compare/v0.2.0...v0.3.0) (2024-07-13)


### Bug Fixes

* **Application:** await added to command exec ([5c31367](https://github.com/JannickOste/StevenCLI/commit/5c313677f6df0c200856992dc552eab19eef438b))
* **CommandDispatcher_Test:** console.log out removed, not relevant for tests ([2702232](https://github.com/JannickOste/StevenCLI/commit/270223235cf2bc87d5d9af1071ddabb6893f046d))
* **CommandLoader_Test:** cleanup ([f9f089d](https://github.com/JannickOste/StevenCLI/commit/f9f089dce6899f655ae86d733f698a817ba49c62))
* **CommandService_test:** psuedocode removed from test ([7d760fe](https://github.com/JannickOste/StevenCLI/commit/7d760fe20e018504f8d8191adcf8849d7aea6645))
* **CommandService:** fixed appropriated towards tests ([d1bc116](https://github.com/JannickOste/StevenCLI/commit/d1bc116cfb140c8307ba1b5cd50da8bb7560fd8c))
* **Definitions:** EventManager registration added ([030bef7](https://github.com/JannickOste/StevenCLI/commit/030bef734be606405793700f8fc4d1c4a2236623))
* **Definitions:** type definitions for command mapper/service added, dummy command removed ([b09ffc6](https://github.com/JannickOste/StevenCLI/commit/b09ffc60b797716d84cf36721aeb05f2e75ffdef))
* **Error:** EventBus uses propper errors now ([f6f7a47](https://github.com/JannickOste/StevenCLI/commit/f6f7a4714eb23eb1421ecddbb5a9a933f59dc3d9))
* **getCommandInfo:** helper function implemented in test ([0b120a1](https://github.com/JannickOste/StevenCLI/commit/0b120a1e73076c8280b25bbaac6d64f0bb2fb163))
* **InMemmoryCommandRepository:** fetch put in try/catch to avoid error on no command definitions ([2b6a769](https://github.com/JannickOste/StevenCLI/commit/2b6a7693f127021dc3ac7a6d2937e3a30c96ce07))
* **InMemoryCommandRepository:** file name fix ([b744aa0](https://github.com/JannickOste/StevenCLI/commit/b744aa0812acdc418a7f6d0fa609f8899684f145))
* **SearchCommandValidator:** tests fixed, type registration added ([294976f](https://github.com/JannickOste/StevenCLI/commit/294976f7312103b3aa7b68a24f865915b0e37343))
* structure fix, models seperated ([ea8a96b](https://github.com/JannickOste/StevenCLI/commit/ea8a96bccf654e258b6e6a703668b205a5379478))


### Features

* **CommandDispatcher:** dispatcher added and events properly implemented and registered ([713596d](https://github.com/JannickOste/StevenCLI/commit/713596d62c9d5f02c64379843d7ba7a2bef116b6))
* **CommandDispatcher:** help event added for generalizer help info display ([4d22df4](https://github.com/JannickOste/StevenCLI/commit/4d22df44ad281d81656a58c5fea1e7c63ead57e7))
* **CommandInfoSerializer:** serializer added ([350a80c](https://github.com/JannickOste/StevenCLI/commit/350a80c157e06010094ab683b1fc18bac92500d0))
* **CommandManager:** command manager added for top level execution ([8ac11b9](https://github.com/JannickOste/StevenCLI/commit/8ac11b91b8f215e18be9309481435b9cbfbde5e1))
* **CommandMapper:** mapper added for remapping collections ([80fd410](https://github.com/JannickOste/StevenCLI/commit/80fd4107d4a203b93e7b272f003bf9347cbf28d3))
* **CommandSearchMapper:** added for final argument mapping towards command ([2285b56](https://github.com/JannickOste/StevenCLI/commit/2285b561b04ddf502d7ecd094ca019b8ea0efb99))
* **CommandTextService:** added service for CLI text printing utilities ([2ca2027](https://github.com/JannickOste/StevenCLI/commit/2ca20275afc30bccf92cda9c10fad76cff5ecd73))
* **EventManager:** Basic event manager added ([6e1b7a6](https://github.com/JannickOste/StevenCLI/commit/6e1b7a647e2ffbfa79254d47fa1e60eb0cf967c2))
* **Events:** Command invoke and error event added ([e96a319](https://github.com/JannickOste/StevenCLI/commit/e96a31999bd0c562bcbc00660b368282cc4a6ab3))

# [0.2.0](https://github.com/JannickOste/StevenCLI/compare/v0.1.0...v0.2.0) (2024-07-07)


### Features

* **CommandService:** command service added ([6111254](https://github.com/JannickOste/StevenCLI/commit/6111254456e3b0fe058834fca2e6321e5f50774b))

# [0.1.0](https://github.com/JannickOste/StevenCLI/compare/v0.0.0...v0.1.0) (2024-07-07)


### Bug Fixes

* **EventBus:** test errors changed to generalized throw ([0564e19](https://github.com/JannickOste/StevenCLI/commit/0564e19ad6550d3a6e3afda64035ce45474c39ea))
* log out file removed ([4c16b41](https://github.com/JannickOste/StevenCLI/commit/4c16b41a79a5377831191d5f08a41e66643ff06b))
* **tests:** import fix ([ab9a12b](https://github.com/JannickOste/StevenCLI/commit/ab9a12bfcfa8ce6193c359ee5333df2f5a96135e))
* **tests:** structure fix ([2e44f86](https://github.com/JannickOste/StevenCLI/commit/2e44f8601b376d9388b0217c77c1ec51a598c264))


### Features

* **Application:** App builder and basic container setup added ([34e125d](https://github.com/JannickOste/StevenCLI/commit/34e125da6bea9d89ddfc6030115bf3613e2d4eca))
* **ApplicationError:** generalized errors added + handler in main function ([3f19683](https://github.com/JannickOste/StevenCLI/commit/3f1968351698f09c54e1b9776d74daa41bb26dbf))
* **Application:** Startup changed to use single type for dependency binding ([50a4334](https://github.com/JannickOste/StevenCLI/commit/50a4334698c9933eff9cb0d7780f7ad803bc6ca4))
* **Command:** Basic command definitions and decorators added ([8f7b101](https://github.com/JannickOste/StevenCLI/commit/8f7b101992a0b674d683d8e8c3ce9065c19da9a4))
* **CommandLoader:** in memory command loader added ([b8c6acc](https://github.com/JannickOste/StevenCLI/commit/b8c6acc4e216ee28ce13c83d077d6ccbcebef03b))
* **CommandRepository:** basic command repository added ([19ae4a7](https://github.com/JannickOste/StevenCLI/commit/19ae4a7b3a8e1f0de5cfc8d251bdbbb5c0b32b3e))
* **CommandSearch:** definition, parser and container binding added ([3c47655](https://github.com/JannickOste/StevenCLI/commit/3c4765537732b1542822bbeb62b7da07d065b0ab))
* **EventBus:** event bus and base event added ([018f66d](https://github.com/JannickOste/StevenCLI/commit/018f66dadc9a0b221add5f2f358a41bbee12c1fa))
* **Publish:** enviroment configuration generation added ([41d8b70](https://github.com/JannickOste/StevenCLI/commit/41d8b70e7988c5e2911278a56e2820144318db44))
* **Publish:** source and build dir added to publisher ([9366c90](https://github.com/JannickOste/StevenCLI/commit/9366c9008410e9971154abacd8f0f51b3e41f609))
