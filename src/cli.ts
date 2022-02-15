#!/usr/bin/env node
import * as yargs from 'yargs';
import { Runner } from './Runner';

let options = yargs
    .usage('$0', 'BrighterScript, a superset of Roku\'s BrightScript language')
    .help('help', 'View help information about this tool.')
    .option('create-package', { type: 'boolean', defaultDescription: 'true', description: 'Creates a zip package. This setting is ignored when deploy is enabled.' })
    .argv;

const runner = new Runner(options);
runner.run().then(() => {
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
