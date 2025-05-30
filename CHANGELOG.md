# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.3.12](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.11...v0.3.12) - 2025-05-30
### Changed
 - Shared CI Support Prerelease ([#4](https://github.com/rokucommunity/roku-report-analyzer/pull/4))
 - Migrate to Shared CI ([#3](https://github.com/rokucommunity/roku-report-analyzer/pull/3))
 - upgrade to [@rokucommunity/logger@0.3.11](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#0311---2025-05-05). Notable changes since 0.3.3:
     - Merge pull request #12 from rokucommunity/migrate-to-shared-ci ([f43e5a4](https://github.com/rokucommunity/roku-report-analyzer/commit/f43e5a4))
     - Fixing issues before release 0.3.10 ([d5babf1](https://github.com/rokucommunity/roku-report-analyzer/commit/d5babf1))
     - Added the ability to turn off timestamps in the output and fixed a potental crash if the format string was empty ([#11](https://github.com/rokucommunity/roku-report-analyzer/pull/11))
     - Keep the timestamp braces outside of the colors ([#10](https://github.com/rokucommunity/roku-report-analyzer/pull/10))
     - Add support for timestampFormat ([#9](https://github.com/rokucommunity/roku-report-analyzer/pull/9))
     - fix node14 ([#8](https://github.com/rokucommunity/roku-report-analyzer/pull/8))
     - Add `printLogLevel` option ([#7](https://github.com/rokucommunity/roku-report-analyzer/pull/7))
     - Allow `LogLevelNumeric` for `timeStart` ([#6](https://github.com/rokucommunity/roku-report-analyzer/pull/6))
     - Add `timeStart` function ([#5](https://github.com/rokucommunity/roku-report-analyzer/pull/5))
     - Add support for numeric logLevel ([#4](https://github.com/rokucommunity/roku-report-analyzer/pull/4))
 - upgrade to [brighterscript@0.69.9](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0699---2025-05-09). Notable changes since 0.65.23:
     - removed no-throw-literal lint rule ([#1489](https://github.com/rokucommunity/roku-report-analyzer/pull/1489))
     - Add `bsc0` cli binary name ([#1490](https://github.com/rokucommunity/roku-report-analyzer/pull/1490))
     - Shared CI Support Prerelease ([#1483](https://github.com/rokucommunity/roku-report-analyzer/pull/1483))
     - Shared CI Support Prerelease ([#1475](https://github.com/rokucommunity/roku-report-analyzer/pull/1475))
     - Prevent runtime crash for non-referencable funcs in ternary and null coalescing ([#1474](https://github.com/rokucommunity/roku-report-analyzer/pull/1474))
     - Fix `removeParameterTypes` compile errors for return types ([#1414](https://github.com/rokucommunity/roku-report-analyzer/pull/1414))
     - Remove `npm ci` from the `package` npm script since it's redundant ([#1461](https://github.com/rokucommunity/roku-report-analyzer/pull/1461))
     - Flag incorrect return statements in functions and subs ([#1463](https://github.com/rokucommunity/roku-report-analyzer/pull/1463))
     - Updated the type definition of the `InStr` global callable ([#1456](https://github.com/rokucommunity/roku-report-analyzer/pull/1456))
     - More safely wrap expressions for template string transpile ([#1445](https://github.com/rokucommunity/roku-report-analyzer/pull/1445))
     - Migration to the new shared CI ([#1440](https://github.com/rokucommunity/roku-report-analyzer/pull/1440))
     - Support plugin factory detecting brighterscript version ([#1438](https://github.com/rokucommunity/roku-report-analyzer/pull/1438))
     - Fixed getClosestExpression bug to return undefined when position not found ([#1433](https://github.com/rokucommunity/roku-report-analyzer/pull/1433))
     - Adds Alias statement syntax from v1 to v0 ([#1430](https://github.com/rokucommunity/roku-report-analyzer/pull/1430))
     - Remove temporary code that was accidentally committed ([#1432](https://github.com/rokucommunity/roku-report-analyzer/pull/1432))
     - Significantly improve the performance of standardizePath ([#1425](https://github.com/rokucommunity/roku-report-analyzer/pull/1425))
     - Bump @babel/runtime from 7.24.5 to 7.26.10 ([#1426](https://github.com/rokucommunity/roku-report-analyzer/pull/1426))
     - Backport v1 typecast syntax to v0 ([#1421](https://github.com/rokucommunity/roku-report-analyzer/pull/1421))
     - Prevent running the lsp project in a worker thread ([#1423](https://github.com/rokucommunity/roku-report-analyzer/pull/1423))
     - Language Server Rewrite ([#993](https://github.com/rokucommunity/roku-report-analyzer/pull/993))
     - Add `validate` flag to ProgramBuilder.run() ([#1409](https://github.com/rokucommunity/roku-report-analyzer/pull/1409))
     - Fix class transpile issue with child class constructor not inherriting parent params ([#1390](https://github.com/rokucommunity/roku-report-analyzer/pull/1390))
     - Export more items ([#1394](https://github.com/rokucommunity/roku-report-analyzer/pull/1394))
     - Add more convenience exports from vscode-languageserver ([#1359](https://github.com/rokucommunity/roku-report-analyzer/pull/1359))
     - Fix bug with ternary transpile for indexed set ([#1357](https://github.com/rokucommunity/roku-report-analyzer/pull/1357))
     - Bump cross-spawn from 7.0.3 to 7.0.6 in /benchmarks ([#1349](https://github.com/rokucommunity/roku-report-analyzer/pull/1349))
     - Add Namespace Source Literals ([#1353](https://github.com/rokucommunity/roku-report-analyzer/pull/1353))
     - [Proposal] Add Namespace Source Literals ([#1354](https://github.com/rokucommunity/roku-report-analyzer/pull/1354))
     - Enhance lexer to support long numeric literals with type designators ([#1351](https://github.com/rokucommunity/roku-report-analyzer/pull/1351))
     - Fix issues with the ast walkArray function ([#1347](https://github.com/rokucommunity/roku-report-analyzer/pull/1347))
     - Optimize ternary transpilation for assignments ([#1341](https://github.com/rokucommunity/roku-report-analyzer/pull/1341))
     - Fix namespace-relative transpile bug for standalone file ([#1324](https://github.com/rokucommunity/roku-report-analyzer/pull/1324))
     - Update README.md with "help" items ([3abcdaf3](https://github.com/rokucommunity/roku-report-analyzer/commit/3abcdaf3))
     - Prevent crash when ProgramBuilder.run called with no options ([#1316](https://github.com/rokucommunity/roku-report-analyzer/pull/1316))
     - Ast node clone ([#1281](https://github.com/rokucommunity/roku-report-analyzer/pull/1281))
     - Bump micromatch from 4.0.5 to 4.0.8 in /benchmarks ([#1295](https://github.com/rokucommunity/roku-report-analyzer/pull/1295))
     - Bump micromatch from 4.0.4 to 4.0.8 ([#1292](https://github.com/rokucommunity/roku-report-analyzer/pull/1292))
     - Add support for resolving sourceRoot at time of config load ([#1290](https://github.com/rokucommunity/roku-report-analyzer/pull/1290))
     - Add support for roIntrinsicDouble ([#1291](https://github.com/rokucommunity/roku-report-analyzer/pull/1291))
     - Add plugin naming convention ([#1284](https://github.com/rokucommunity/roku-report-analyzer/pull/1284))
     - Bump requirejs from 2.3.6 to 2.3.7 ([#1269](https://github.com/rokucommunity/roku-report-analyzer/pull/1269))
     - Add templatestring support for annotation.getArguments() ([#1264](https://github.com/rokucommunity/roku-report-analyzer/pull/1264))
     - Update Digitial Picture Frame url and img ([#1237](https://github.com/rokucommunity/roku-report-analyzer/pull/1237))
     - Fix crash with missing scope ([#1234](https://github.com/rokucommunity/roku-report-analyzer/pull/1234))
     - Bump braces from 3.0.2 to 3.0.3 in /benchmarks ([#1229](https://github.com/rokucommunity/roku-report-analyzer/pull/1229))
     - fix: conform bsconfig.schema.json to strict types ([#1205](https://github.com/rokucommunity/roku-report-analyzer/pull/1205))
     - Flag using devDependency in production code ([#1222](https://github.com/rokucommunity/roku-report-analyzer/pull/1222))
     - Fix crash with optional chaining in signature help ([#1207](https://github.com/rokucommunity/roku-report-analyzer/pull/1207))
     - Logger nocolor ([#1189](https://github.com/rokucommunity/roku-report-analyzer/pull/1189))
     - Fix crash when diagnostic is missing range ([#1174](https://github.com/rokucommunity/roku-report-analyzer/pull/1174))
     - Fix formatting with logger output ([#1171](https://github.com/rokucommunity/roku-report-analyzer/pull/1171))
     - Move function calls to separate diagnostic ([#1169](https://github.com/rokucommunity/roku-report-analyzer/pull/1169))
     - fix: resolve the stagingDir option relative to the bsconfig.json file ([#1148](https://github.com/rokucommunity/roku-report-analyzer/pull/1148))
     - Bump tar from 6.1.13 to 6.2.1 in /benchmarks ([#1131](https://github.com/rokucommunity/roku-report-analyzer/pull/1131))
     - Fix node14 issues ([#1153](https://github.com/rokucommunity/roku-report-analyzer/pull/1153))
     - Upgrade to @rokucommunity/logger ([#1137](https://github.com/rokucommunity/roku-report-analyzer/pull/1137))
     - Improve workspace/document symbol handling ([#1120](https://github.com/rokucommunity/roku-report-analyzer/pull/1120))
     - Plugin hook provide workspace symbol ([#1118](https://github.com/rokucommunity/roku-report-analyzer/pull/1118))
     - Upgade LSP packages ([#1117](https://github.com/rokucommunity/roku-report-analyzer/pull/1117))
     - Add plugin hook for documentSymbol ([#1116](https://github.com/rokucommunity/roku-report-analyzer/pull/1116))
     - Increase max param count to 63 ([#1112](https://github.com/rokucommunity/roku-report-analyzer/pull/1112))
     - Prevent unused variable warnings on ternary and null coalescence expressions ([#1101](https://github.com/rokucommunity/roku-report-analyzer/pull/1101))
     - Support when tokens have null ranges ([#1072](https://github.com/rokucommunity/roku-report-analyzer/pull/1072))
     - Support whitespace in conditional compile keywords ([#1090](https://github.com/rokucommunity/roku-report-analyzer/pull/1090))
     - Add `create-test-package` command for easier tgz testing ([#1088](https://github.com/rokucommunity/roku-report-analyzer/pull/1088))
     - Allow negative patterns in diagnostic filters ([#1078](https://github.com/rokucommunity/roku-report-analyzer/pull/1078))
     - Bump ip from 2.0.0 to 2.0.1 in /benchmarks ([#1079](https://github.com/rokucommunity/roku-report-analyzer/pull/1079))
     - Reduce null safety issues in Statement and Expression subclasses ([#1033](https://github.com/rokucommunity/roku-report-analyzer/pull/1033))
### Fixed
 - fix node14 ([#2](https://github.com/rokucommunity/roku-report-analyzer/pull/2))



## [0.3.11](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.10...v0.3.11) - 2024-03-01
### Changed
 - upgrade to [brighterscript@0.65.23](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06523---2024-02-29). Notable changes since 0.65.12:
     - Allow v1 syntax: built-in types for class member types and type declarations on lhs ([brighterscript#1059](https://github.com/rokucommunity/brighterscript/pull/1059))
     - Move `coveralls-next` to a devDependency since it's not needed at runtime ([brighterscript#1051](https://github.com/rokucommunity/brighterscript/pull/1051))
     - Fix parsing issues with multi-index IndexedSet and IndexedGet ([brighterscript#1050](https://github.com/rokucommunity/brighterscript/pull/1050))
     - Backport v1 syntax changes ([brighterscript#1034](https://github.com/rokucommunity/brighterscript/pull/1034))
     - Prevent overwriting the Program._manifest if already set on startup ([brighterscript#1027](https://github.com/rokucommunity/brighterscript/pull/1027))
     - adds support for libpkg prefix ([brighterscript#1017](https://github.com/rokucommunity/brighterscript/pull/1017))
     - Assign .program to the builder BEFORE calling afterProgram ([brighterscript#1011](https://github.com/rokucommunity/brighterscript/pull/1011))
     - Prevent errors when using enums in a file that's not included in any scopes ([brighterscript#995](https://github.com/rokucommunity/brighterscript/pull/995))



## [0.3.10](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.9...v0.3.10) - 2023-12-07
### Changed
 - upgrade to [brighterscript@0.65.12](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06512---2023-12-07). Notable changes since 0.65.10:
     - Correct RANGE in template string when dealing with quotes in annotations ([brighterscript#975](https://github.com/rokucommunity/brighterscript/pull/975))



## [0.3.9](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.8...v0.3.9) - 2023-11-14
### Changed
 - upgrade to [brighterscript@0.65.10](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06510---2023-11-14). Notable changes since 0.65.8:
     - Fix issue with unary expression parsing ([brighterscript#938](https://github.com/rokucommunity/brighterscript/pull/938))
     - ci: Don't run `test-related-projects` on release since it already ran on build ([#brighterscript157fc2e](https://github.com/rokucommunity/brighterscript/commit/157fc2e))



## [0.3.8](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.7...v0.3.8) - 2023-10-08
### Changed
 - upgrade to [brighterscript@0.65.8](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0658---2023-10-06). Notable changes since 0.65.0:



## [0.3.7](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.6...v0.3.7) - 2023-05-17
### Changed
 - upgrade to [@rokucommunity/logger@0.3.3](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#033---2023-05-17)
 - upgrade to [brighterscript@0.65.0](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0650---2023-05-17). Notable changes since 0.64.2:
     - npm audit fixes. upgrade to coveralls-next ([#brighterscript43756d8](https://github.com/rokucommunity/brighterscript/commit/43756d8))
     - Improves performance in symbol table fetching ([brighterscript#797](https://github.com/rokucommunity/brighterscript/pull/797))



## [0.3.6](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.5...v0.3.6) - 2023-04-18
### Changed
 - upgrade to [brighterscript@0.64.2](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0642---2023-04-18). Notable changes since 0.62.0:
     - Bump xml2js from 0.4.23 to 0.5.0 ([brighterscript#790](https://github.com/rokucommunity/brighterscript/pull/790))



## [0.3.5](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.4...v0.3.5) - 2023-03-17
### Changed
 - upgrade to [@rokucommunity/logger@0.3.2](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#032---2023-03-16). Notable changes since 0.3.1:
     - Fix crash when encountering bigint ([@rokucommunity/logger#3](https://github.com/rokucommunity/logger/pull/3))
 - upgrade to [brighterscript@0.62.0](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0620---2023-03-17). Notable changes since 0.61.3:
     - Optional chaining assignment validation ([brighterscript#782](https://github.com/rokucommunity/brighterscript/pull/782))
     - Fix crash when func has no block ([brighterscript#774](https://github.com/rokucommunity/brighterscript/pull/774))
     - Move not-referenced check into ProgramValidator ([brighterscript#773](https://github.com/rokucommunity/brighterscript/pull/773))



## [0.3.4](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.3...v0.3.4) - 2023-01-24
### Changed
 - fixed some npm audit issues
 - upgrade to [@rokucommunity/logger@0.3.1](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#031---2023-01-24)



## [0.3.3](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.2...v0.3.3) - 2023-01-12
### Changed
 - upgrade to [brighterscript@0.61.3](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0613---2023-01-12)



## [0.3.2](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.1...v0.3.2) - 2022-12-15
### Changed
 - upgrade to [brighterscript@0.61.2](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0612---2022-12-15). Notable changes since 0.60.4:
     - Fix exception while validating continue statement ([brighterscript#752](https://github.com/rokucommunity/brighterscript/pull/752))
     - Add missing visitor params for DottedSetStatement ([brighterscript#748](https://github.com/rokucommunity/brighterscript/pull/748))
     - Fixes issues with Roku doc scraper and adds missing components ([brighterscript#736](https://github.com/rokucommunity/brighterscript/pull/736))
     - Cache `getCallableByName` ([brighterscript#739](https://github.com/rokucommunity/brighterscript/pull/739))



## [0.3.1](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.3.0...v0.3.1) - 2022-10-28
### Changed
 - upgrade to [brighterscript@0.60.4](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0604---2022-10-28)



## [0.3.0](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.2.4...v0.3.0) - 2022-10-20
### Added
 - Initial implementation of parseCrashes() ([#1](https://github.com/rokucommunity/roku-report-analyzer/pull/1))
### Changed
 - upgrade to [brighterscript@0.60.3](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0603---2022-10-20)



## [0.2.4](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.2.3...v0.2.4) - 2022-09-02
### Changed
 - upgrade to [brighterscript@0.57.0](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0570---2022-09-02). Notable changes since 0.55.1:



## [0.2.3](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.2.2...v0.2.3) - 2022-08-12
### Changed
 - upgrade to [brighterscript@0.55.1](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0551---2022-08-07)



## [0.2.2](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.2.1...v0.2.2) - 2022-07-18
### Changed
 - upgrade to [@rokucommunity/logger@0.3.0](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#030---2022-04-19)
 - upgrade to [brighterscript@0.53.1](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0531---2022-07-15)



## [0.2.1](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.2.0...v0.2.1) - 2022-04-13
### Fixed
 - npm audit issue



## [0.2.0](https://github.com/rokucommunity/roku-report-analyzer/compare/v0.1.0...v0.2.0) - 2022-03-08
### Added
 - basic logging to track progress and debug issues
### Fixed
 - CLI issues
 - increased accuracy of sourcemap location lookups (changed bias)



## [0.1.0](https://github.com/rokucommunity/roku-report-analyzer/compare/eeaf5ca45ea7f46fc852badacf54c1ddffbca61f...v0.1.0) - 2022-03-02
### Added
 - initial release
