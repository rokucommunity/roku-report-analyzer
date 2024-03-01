# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



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
