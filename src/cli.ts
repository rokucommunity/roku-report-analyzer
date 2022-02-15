#!/usr/bin/env node
import * as yargs from 'yargs';
import { Runner } from './Runner';

let options = yargs
    .usage('$0', 'BrighterScript, a superset of Roku\'s BrightScript language')
    .help('help', 'View help information about this tool.')
    .option('$0 [crashlogs..]', { type: 'array', defaultDescription: 'true', description: 'One or more globs that match to crash logs. Any zip archives encountered will be extracted, and all files inside will be processed.' })
    .option('cwd', { type: 'string', description: 'Override the current working directory' })
    .option('outDir', { type: 'string', description: 'The directory where the processed logs should be written', defaultDescription: './dest' })
    .option('project', { type: 'array', defaultDescription: 'true', description: 'Creates a zip package. This setting is ignored when deploy is enabled.' })
    .option('libs', { type: 'array', defaultDescription: 'true', description: 'One or more component library folders that contain sourcemaps. Will scan for a manifest file to identify sg_component_libs_provided. You can override/supply sg_component_libs_provided by prefixing the path with the sg_component_libs_provided value and a semicolon. (i.e. "--libs YourComplib;../path/to/complib"' })
    .argv;

const runner = new Runner(options as any);
runner.run().then(() => {
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
