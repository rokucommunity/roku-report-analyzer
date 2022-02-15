import * as globAll from 'glob-all';
import * as path from 'path';
import * as extract from 'extract-zip';
import * as fsExtra from "fs-extra";
import { CrashlogFile } from './CrashlogFile';

export class Runner {
    public constructor(
        public options: RunnerOptions
    ) {
    }

    private get cwd() {
        return path.resolve(this.options.cwd ?? process.cwd());
    }

    private get outDir() {
        return path.join(this.cwd, this.options.outDir ?? 'dist');
    }

    public async run() {
        //clear the outDir
        fsExtra.emptydirSync(this.outDir);

        this.loadCrashlogs();
        this.loadProject();
        this.loadCompLibs();
    }

    private crashlogFiles: CrashlogFile[] = [];

    /**
     * Load all provided crash logs
     */
    private async loadCrashlogs() {
        const logs = globAll.sync(this.options.crashlogs, {
            absolute: true,
            cwd: this.cwd
        });
        for (let i = 0; i < logs.length; i++) {
            const logPath = logs[i];
            //if this logPath is a zip archive, unzip it and add all the files
            if (logPath.toLowerCase().endsWith('.zip')) {
                const dest = path.join(this.outDir, path.basename(logPath));
                //extract the zip and then process all the found files
                await extract(logPath, {
                    dir: dest
                });
                //add all extracted files to the list to be processed
                logs.push(
                    ...globAll.sync(['**/*'], {
                        absolute: true,
                        cwd: dest
                    })
                );
            } else {
                this.crashlogFiles.push(
                    new CrashlogFile(logPath)
                );
            }
        }
    }

    private async loadProject() {
    }

    private async loadCompLibs() {

    }
}

interface RunnerOptions {
    /**
     * An array of globs used to find crash logs
     */
    crashlogs: string[];
    /**
     * The path to the root application folder containing sourcemaps
     */
    project: string;
    /**
     * Component library paths, optionally prefixed with sg_component_libs_provided
     */
    libs?: string[];
    /**
     * Overrides the current working directory
     */
    cwd?: string;

    /**
     * the root output directory.
     * @default "dest"
     */
    outDir?: string;
}