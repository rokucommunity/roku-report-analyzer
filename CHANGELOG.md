# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.3.22](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.21...v0.3.22) - 2026-09-09
### Changed
 - upgrade to [brighterscript@0.73.3](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0733---2026-09-09). Notable changes since 0.73.1:
     - Security enhancements ([#1796](https://github.com/rokucommunity/brighterscript/pull/1796))
     - Add `isTerminal` and `previousInChain` getters to AstNode ([#1788](https://github.com/rokucommunity/brighterscript/pull/1788))
     - Reduce per-Token lexer allocation to cut GC pressure while editing ([#1712](https://github.com/rokucommunity/brighterscript/pull/1712))



## [0.3.21](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.20...v0.3.21) - 2026-09-02
### Changed
 - upgrade to [@rokucommunity/logger@0.4.2](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#042---2026-09-02). Notable changes since 0.3.13:
     - Security enhancements ([#39](https://github.com/rokucommunity/logger/pull/39))
     - Security enhancements ([#38](https://github.com/rokucommunity/logger/pull/38))
     - chore: Simplify create-vsix inputs and improve branch resolution ([#36](https://github.com/rokucommunity/logger/pull/36))
     - chore: Give fork PRs a clear create-vsix failure message ([#35](https://github.com/rokucommunity/logger/pull/35))
     - Serialize Error.cause (recursively) when logging ([#33](https://github.com/rokucommunity/logger/pull/33))
     - chore: Update create-vsix to support multi-vsix and shared bot logic ([#32](https://github.com/rokucommunity/logger/pull/32))
     - Reduce public API surface and implement API Extractor ([#30](https://github.com/rokucommunity/logger/pull/30))
     - chore: Reduce prod deps 6 → 1 (inline single-use helpers) + consolidate source-map-support ([#29](https://github.com/rokucommunity/logger/pull/29))
 - upgrade to [brighterscript@0.73.1](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0731---2026-09-02). Notable changes since 0.72.5:
     - Security enhancements ([#1782](https://github.com/rokucommunity/brighterscript/pull/1782))
     - Keep synthesized Tokens on the lexer's hidden class ([#1781](https://github.com/rokucommunity/brighterscript/pull/1781))
     - Report mismatched XML element pairs ([#1746](https://github.com/rokucommunity/brighterscript/pull/1746))
     - Add <field> and <function> completions in xml interfaces ([#1748](https://github.com/rokucommunity/brighterscript/pull/1748))
     - Cap LSP worker thread pool to fix memory scaling with project count ([#1776](https://github.com/rokucommunity/brighterscript/pull/1776))
     - Add warning for function names that exceed the truncation limit ([#1777](https://github.com/rokucommunity/brighterscript/pull/1777))
     - Security enhancements ([#1775](https://github.com/rokucommunity/brighterscript/pull/1775))
     - Bump brace-expansion in /benchmarks ([#1774](https://github.com/rokucommunity/brighterscript/pull/1774))
     - Security enhancements ([#1773](https://github.com/rokucommunity/brighterscript/pull/1773))
     - Bump qs from 6.14.2 to 6.15.3 ([#1766](https://github.com/rokucommunity/brighterscript/pull/1766))
     - Bump postcss from 8.5.10 to 8.5.25 ([#1764](https://github.com/rokucommunity/brighterscript/pull/1764))
     - Bump fast-uri from 3.1.2 to 3.1.4 ([#1763](https://github.com/rokucommunity/brighterscript/pull/1763))
     - chore: Simplify create-vsix inputs and improve branch resolution ([#1772](https://github.com/rokucommunity/brighterscript/pull/1772))
     - chore: Give fork PRs a clear create-vsix failure message ([#1770](https://github.com/rokucommunity/brighterscript/pull/1770))
     - Fix compile break against roku-deploy 3.18 ([#1752](https://github.com/rokucommunity/brighterscript/pull/1752))
     - Add SceneGraph XML element and attribute completions ([#1741](https://github.com/rokucommunity/brighterscript/pull/1741))
     - chore: Update create-vsix to support multi-vsix and shared bot logic ([#1740](https://github.com/rokucommunity/brighterscript/pull/1740))
     - Validate eval/rsg_version against firmware lifecycle ([#1698](https://github.com/rokucommunity/brighterscript/pull/1698))
     - Remove more prod deps: (drop array-flat-polyfill/readline, consolidate minimatch into micromatch) ([#1737](https://github.com/rokucommunity/brighterscript/pull/1737))
     - Replace single-use deps with util/formatUtils helpers ([#1736](https://github.com/rokucommunity/brighterscript/pull/1736))
     - chore: remove dead production dependencies ([#1735](https://github.com/rokucommunity/brighterscript/pull/1735))
     - Bump form-data from 2.5.5 to 2.5.6 ([#1733](https://github.com/rokucommunity/brighterscript/pull/1733))



## [0.3.20](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.19...v0.3.20) - 2026-06-10
### Changed
 - upgrade to [@rokucommunity/logger@0.3.13](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#0313---2026-06-08). Notable changes since 0.3.11:
     - Security fixes ([#27](https://github.com/rokucommunity/logger/pull/27), [#26](https://github.com/rokucommunity/logger/pull/26), [#24](https://github.com/rokucommunity/logger/pull/24), [#21](https://github.com/rokucommunity/logger/pull/21), [#19](https://github.com/rokucommunity/logger/pull/19), [#17](https://github.com/rokucommunity/logger/pull/17), [#16](https://github.com/rokucommunity/logger/pull/16))
 - upgrade to [brighterscript@0.72.5](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0725---2026-06-10). Notable changes since 0.72.1:
     - Security fixes ([#1723](https://github.com/rokucommunity/brighterscript/pull/1723), [#1722](https://github.com/rokucommunity/brighterscript/pull/1722), [#1720](https://github.com/rokucommunity/brighterscript/pull/1720), [#1718](https://github.com/rokucommunity/brighterscript/pull/1718), [#1714](https://github.com/rokucommunity/brighterscript/pull/1714))



## [0.3.19](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.18...v0.3.19) - 2026-05-11
### Changed
 - upgrade to [brighterscript@0.72.1](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0721---2026-05-11). Notable changes since 0.70.4:



## [0.3.18](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.17...v0.3.18) - 2026-03-24
### Changed
 - upgrade to [brighterscript@0.70.4](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0704---2026-03-24). Notable changes since 0.70.3:
     - Typedef namespace param fix ([#1641](https://github.com/rokucommunity/brighterscript/pull/1641))
     - Backport V1 Typed function type syntax to v0 ([#1623](https://github.com/rokucommunity/brighterscript/pull/1623))
     - spelling fix ([#1621](https://github.com/rokucommunity/brighterscript/pull/1621))
     - Backport `for each` type syntax from V1 -> V0 ([#1617](https://github.com/rokucommunity/brighterscript/pull/1617))
     - Back ports intersection type and grouped type expressions ([#1608](https://github.com/rokucommunity/brighterscript/pull/1608))
     - Backports TypeStatement syntax from v1 to v0 ([#1600](https://github.com/rokucommunity/brighterscript/pull/1600))
     - Backported v1 inline interface syntax ([#1592](https://github.com/rokucommunity/brighterscript/pull/1592))
     - Fix confusing diagnostic when dottedGet follows function call in ExpressionStatement ([#1598](https://github.com/rokucommunity/brighterscript/pull/1598))



## [0.3.17](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.16...v0.3.17) - 2025-10-31
### Changed
 - chore: support OIDC for publishing ([#13](https://github.com/rokucommunity/roku-report-analyzer/pull/13))
 - upgrade to [brighterscript@0.70.3](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0703---2025-10-31). Notable changes since 0.70.2:
     - Fix crash when bsc plugin in worker loads another version of bsc ([#1579](https://github.com/rokucommunity/brighterscript/pull/1579))
     - Fix recursive const and enum resolution during transpilation ([#1578](https://github.com/rokucommunity/brighterscript/pull/1578))



## [0.3.16](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.15...v0.3.16) - 2025-10-10
### Changed
 - upgrade to [brighterscript@0.70.2](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0702---2025-10-10). Notable changes since 0.69.13:



## [0.3.15](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.14...v0.3.15) - 2025-08-04
### Changed
 - upgrade to [brighterscript@0.69.13](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06913---2025-08-04). Notable changes since 0.69.11:



## [0.3.14](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.13...v0.3.14) - 2025-07-03
### Changed
 - upgrade to [brighterscript@0.69.11](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06911---2025-07-03). Notable changes since 0.69.10:



## [0.3.13](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.12...v0.3.13) - 2025-06-03
### Changed
 - upgrade to [brighterscript@0.69.10](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06910---2025-06-03). Notable changes since 0.69.9:



## [0.3.12](https://github.com/rokucommunity/roku-report-analyzer/compare/0.3.11...v0.3.12) - 2025-05-30
### Changed
 - upgrade to [@rokucommunity/logger@0.3.11](https://github.com/rokucommunity/logger/blob/master/CHANGELOG.md#0311---2025-05-05). Notable changes since 0.3.3:
     - Keep the timestamp braces outside of the colors ([#10](https://github.com/rokucommunity/roku-report-analyzer/pull/10))
     - fix node14 ([#8](https://github.com/rokucommunity/roku-report-analyzer/pull/8))
 - upgrade to [brighterscript@0.69.9](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0699---2025-05-09). Notable changes since 0.65.23:
     - Prevent runtime crash for non-referencable funcs in ternary and null coalescing ([#1474](https://github.com/rokucommunity/roku-report-analyzer/pull/1474))
     - Adds Alias statement syntax from v1 to v0 ([#1430](https://github.com/rokucommunity/roku-report-analyzer/pull/1430))
     - Significantly improve the performance of standardizePath ([#1425](https://github.com/rokucommunity/roku-report-analyzer/pull/1425))
     - Backport v1 typecast syntax to v0 ([#1421](https://github.com/rokucommunity/roku-report-analyzer/pull/1421))
     - Prevent running the lsp project in a worker thread ([#1423](https://github.com/rokucommunity/roku-report-analyzer/pull/1423))
     - Add `validate` flag to ProgramBuilder.run() ([#1409](https://github.com/rokucommunity/roku-report-analyzer/pull/1409))
     - Add more convenience exports from vscode-languageserver ([#1359](https://github.com/rokucommunity/roku-report-analyzer/pull/1359))
     - Fix issues with the ast walkArray function ([#1347](https://github.com/rokucommunity/roku-report-analyzer/pull/1347))
     - Flag using devDependency in production code ([#1222](https://github.com/rokucommunity/roku-report-analyzer/pull/1222))
     - Fix crash when diagnostic is missing range ([#1174](https://github.com/rokucommunity/roku-report-analyzer/pull/1174))
     - Fix node14 issues ([#1153](https://github.com/rokucommunity/roku-report-analyzer/pull/1153))
     - Support when tokens have null ranges ([#1072](https://github.com/rokucommunity/roku-report-analyzer/pull/1072))
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
