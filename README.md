# roku-report-analyzer
Leverage sourcemaps to translate pkg paths from Roku crash logs into original file paths

[![build status](https://img.shields.io/github/workflow/status/rokucommunity/roku-report-analyzer/build.svg?logo=github)](https://github.com/rokucommunity/roku-report-analyzer/actions?query=workflow%3Abuild)
[![coverage status](https://img.shields.io/coveralls/github/rokucommunity/roku-report-analyzer?logo=coveralls)](https://coveralls.io/github/rokucommunity/roku-report-analyzer?branch=master)
[![monthly downloads](https://img.shields.io/npm/dm/roku-report-analyzer.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/roku-report-analyzer?minimal=true)
[![npm version](https://img.shields.io/npm/v/roku-report-analyzer.svg?logo=npm)](https://www.npmjs.com/package/roku-report-analyzer)
[![license](https://img.shields.io/npm/l/roku-report-analyzer.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)

## Description
The purpose of roku-report-analyzer (rra) is to standardize the roku crash log reports that get emailed to you directly from roku on a regular basis. Those crashlogs normall include the file paths in the format `pkg:/source/main.brs(10)` or `yourcomplib:/components/SomeComponent.xml(12)`.
### Goals
- translate device locations (`pkg:/source/main.brs(10)`) into source code locations (`C:/projects/YourRokuApp/src/source/main.brs(10)`).
- leverage source maps for transpiled projects (such as those built by [BrighterScript](https://github.com/RokuCommunity/brighterscript))
- flatten the report folder structure
- use globs for finding many crashlogs
- automatically unzip crashlog folders

## Installation
### Local Install
We recommend installing roku-report-analyzer locally within your project as a devDependency. This way, you can ensure the tool always works with a specific project.
```bash
npm install roku-report-analyzer -D
```

## Usage
### Basic usage
A simple project
```bash
npx rra ./crashlogs/AwesomeRokuApp_A50.zip --projects ./projects/AwesomeRokuApp
```

### Multiple crashlogs
rra supports globs for finding crashlogs, and supports zips as well as unzipped folders. You can specify as many globs as you wish.
```bash
npx rra ./app1/crashlogs/**/*.text ../downloads/**/*.text ./crashZips/*.zip --projects ./projects/AwesomeRokuApp
```

### Multiple projects
Perhaps your project is assembled from multiple source projects
```bash
npx rra ./crashlogs/AwesomeRokuApp_A50.zip --projects ./projects/AwesomeRokuApp_base ./projects/AwesomeRokuApp_overrides1 ./projects/AwesomeRokuApp_overrides2
```

### Component libraries
If you use component libraries, those file paths will be prefixed by the `sg_component_libs_provided` value from the manifest. By default, we will look for that value in each project's manifest file. However, you can set it manually by adding it to the front of your project path separated by a colon (i.e. `somecomplib:./projects/path/to/complib`).
```bash
npx rra ./crashlogs/AwesomeRokuApp_A50.zip --projects pkg:./projects/AwesomeRokuApp yourcomplib:./projects/complib
```

### cwd
You can override the current working directory like this:
```bash
npx rra --cwd C:/wherever ./crashlogs/**/*.zip --projects ./projects/CoolApp
```

### Help
Run the `--help` command to view all the available options
```bash
npx rra --help
```


