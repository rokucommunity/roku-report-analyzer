import * as extract from 'extract-zip';
import * as fsExtra from 'fs-extra';
import * as globAll from 'glob-all';
import * as path from 'path';
import type { Location, Reporter, RunnerOptions } from './interfaces';
import { CrashlogFile } from './CrashlogFile';
import type { Logger } from '@rokucommunity/logger';
import { Project } from './Project';
import { StandardReporter } from './reporters/StandardReporter';
import logger from '@rokucommunity/logger';
import { standardizePath as s } from 'brighterscript';
import { util } from './util';

export class Runner {
    public constructor(
        public options: RunnerOptions
    ) {
        this.logger = logger.createLogger({ logLevel: this.options.logLevel });
        this.validateOptions();
    }

    public logger: Logger;

    private validateOptions() {
        if (!Array.isArray(this.options.crashlogs) || this.options.crashlogs?.length < 1) {
            throw new Error('crashlogs list may not be empty');
        }
    }

    public get cwd() {
        return path.resolve(this.options.cwd ?? process.cwd());
    }

    public get outDir() {
        return s`${path.join(this.cwd, this.options.outDir ?? 'dist')}`;
    }

    private get tempDir() {
        return s`${path.join(this.outDir, '.tmp')}`;
    }

    public reporters: Reporter[] = [
        new StandardReporter(this)
    ];

    public async run() {
        //clear the outDir
        fsExtra.emptydirSync(this.outDir);

        //load all projects
        await this.loadProjects();

        //load the crashlogs
        await this.loadCrashlogs();

        //perform a lookup of every crashlog file path
        this.logger.log('parsing crashlogs');
        await Promise.all(
            this.files.map(x => x.process())
        );

        //execute every reporter
        this.logger.log('Generating results');
        await Promise.all(
            this.reporters.map(x => x.generate(this))
        );

        //delete the tmp folder
        await fsExtra.remove(this.tempDir);
        this.logger.log('Done');
    }

    public files: CrashlogFile[] = [];

    /**
     * All projects that contain source code (and source maps) which will be referenced
     * when translating pkg paths to file system paths.
     */
    private projects: Project[] = [];

    /**
     * Load all provided crash logs
     */
    private async loadCrashlogs() {
        this.logger.log('Searching for crashlogs');
        this.logger.info({ globs: this.options.crashlogs, cwd: this.cwd });
        const logs = globAll.sync(this.options.crashlogs, {
            absolute: true,
            cwd: this.cwd
        });

        for (const logPath of logs) {
            //if this logPath is a zip archive, unzip it and add all the files
            if (logPath.toLowerCase().endsWith('.zip')) {
                const dest = s`${path.join(this.tempDir, path.basename(logPath))}`;
                //extract the zip and then process all the found files
                await extract(logPath, {
                    dir: dest
                });

                const unzippedFiles = globAll.sync(['**/*'], {
                    absolute: true,
                    cwd: dest
                }).filter(x => !util.isDirSync(x));

                //add all extracted files to the list to be processed
                logs.push(...unzippedFiles);
            } else {
                this.files.push(
                    new CrashlogFile(this, logPath)
                );
            }
        }
        logger.log(`found ${this.files.length} crashlogs`);
        logger.info({ crashlogs: this.files.map(x => x.srcPath) });

        //load all file contents
        await Promise.all(this.files.map(async file => {
            const contents = await fsExtra.readFile(file.srcPath);
            file.parse(contents.toString());
        }));
    }

    private async loadProjects() {
        for (const complib of this.options.projects ?? []) {
            const project = new Project(this, complib);
            this.projects.push(project);
        }
        await Promise.all(
            this.projects.map(x => x.load())
        );
    }

    /**
     * Convert a pkg location into source location(s)
     */
    public async getOriginalLocations(location: Location) {
        const locations = await Promise.all(
            this.projects.map(x => x.getOriginalLocation(location))
        );
        return locations.filter(x => !!x);
    }
}
