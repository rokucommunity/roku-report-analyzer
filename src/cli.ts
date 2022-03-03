#!/usr/bin/env node
import * as yargs from 'yargs';
import { Runner } from './Runner';

//builder.command('$0', { type: 'array', defaultDescription: 'true', description: 'One or more globs that match to crash logs. Any zip archives encountered will be extracted, and all files inside will be processed.' })
(async () => {
    await yargs
        .usage('$0', 'roku-report-analyzer: a tool to analyze and standardize roku crash logs')
        .help('help', 'View help information about this tool.')
        .command('$0', 'process', (yargs) => {
            return yargs
                .option('crashlogs', {
                    type: 'array',
                    defaultDescription: 'true',
                    description: 'Paths (glob-enabled) to crashlogs. Can be '
                })
                .option('outDir', {
                    type: 'string',
                    description: 'The directory where the processed logs should be written',
                    defaultDescription: './dest'
                })
                .options('cwd', {
                    type: 'string',
                    description: 'The override the current working directory for the tool'
                })
                .option('projects', {
                    alias: 'project',
                    type: 'array',
                    defaultDescription: 'true',
                    demandOption: true,
                    description: 'Paths to source code folders, optionally prefixed with sg_component_libs_provided. For example: ["C:/projects/mainApp", "./complib1", "complib2:C:/projects/complib2"]'
                });
        }, (args) => {
            args.crashlogs = (args.crashlogs ?? args._ ?? []).map(x => x.toString());
            const runner = new Runner(args as any);
            runner.run().catch(handleError);
        })
        .example('$0', './OSCrashes-2022-02-12/**/*.text --project ./YourAppCode')
        .example('$0', './crashlogs/**/* --projects ./YourAppCode yourcomplib:./ComplibCode')
        .example('$0', './crashlogs/**/* --projects ./YourAppCode --outDir ./crashlogs_formatted')
        .example('$0', './crashlogs/**/* --projects ./YourAppCode --cwd ../../some_folder')
        .option('cwd', { type: 'string', description: 'Override the current working directory', global: true })
        .argv;

})().catch(handleError);

function handleError(err: any) {
    console.error(err);
    process.exit(1);
}
