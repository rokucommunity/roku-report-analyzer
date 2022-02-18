import * as extract from 'extract-zip';
import * as fsExtra from 'fs-extra';
import * as globAll from 'glob-all';
import * as path from 'path';
import { CrashlogFile } from './CrashlogFile';
import { Project } from './Project';
import { util } from './util';

export class Runner {
    public constructor(
        public options: RunnerOptions
    ) {
    }

    public get cwd() {
        return path.resolve(this.options.cwd ?? process.cwd());
    }

    public get outDir() {
        return path.join(this.cwd, this.options.outDir ?? 'dist');
    }

    public async run() {
        //clear the outDir
        fsExtra.emptydirSync(this.outDir);

        await Promise.all([
            this.loadCrashlogs(),
            this.loadProjects()
        ]);
    }

    private crashlogFiles: CrashlogFile[] = [];

    /**
     * All projects that contain source code (and source maps) which will be referenced
     * when translating pkg paths to file system paths.
     */
    private projects: Project[] = [];

    /**
     * Load all provided crash logs
     */
    private async loadCrashlogs() {
        const logs = globAll.sync(this.options.crashlogs, {
            absolute: true,
            cwd: this.cwd
        });
        for (const logPath of logs) {
            //if this logPath is a zip archive, unzip it and add all the files
            if (logPath.toLowerCase().endsWith('.zip')) {
                const dest = path.join(this.outDir, path.basename(logPath));
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
                this.crashlogFiles.push(
                    new CrashlogFile(logPath)
                );
            }
        }
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
}

export interface RunnerOptions {
    /**
     * An array of globs used to find crash logs
     */
    crashlogs: string[];

    /**
     * Paths to source code folders, optionally prefixed with sg_component_libs_provided.
     * For example: ["C:/projects/mainApp", "./complib1", "complib2:C:/projects/complib2"]
     */
    projects: string[];

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
