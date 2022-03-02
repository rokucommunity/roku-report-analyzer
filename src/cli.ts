#!/usr/bin/env node
import * as yargs from 'yargs';
import { Runner } from './Runner';

let options = yargs
    .usage('$0', 'roku-report-analyzer: a tool to analyze and standardize roku crash logs')
    .help('help', 'View help information about this tool.')
    .option('$0 [crashlogs..]', { type: 'array', defaultDescription: 'true', description: 'One or more globs that match to crash logs. Any zip archives encountered will be extracted, and all files inside will be processed.' })
    .option('cwd', { type: 'string', description: 'Override the current working directory' })
    .option('outDir', { type: 'string', description: 'The directory where the processed logs should be written', defaultDescription: './dest' })
    .option('projects', { type: 'array', defaultDescription: 'true', description: 'Paths to source code folders, optionally prefixed with sg_component_libs_provided. For example: ["C:/projects/mainApp", "./complib1", "complib2:C:/projects/complib2"]' })
    .argv;

const runner = new Runner(options as any);
runner.run().then(() => {
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
