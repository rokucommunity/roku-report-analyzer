import type { LogLevel } from '@rokucommunity/logger';
import type { Range } from 'brighterscript';
import type { Runner } from './Runner';

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

    /**
     * What level of logging should be done during this run
     */
    logLevel?: LogLevel;
}

export interface FileReference {
    /**
     * The location in the log where this file reference is located
     */
    range: Range;
    /**
     * The 0-based char index in the entire file where the match starts
     */
    offset: number;
    /**
     * The length of the current reference in the log file
     */
    length: number;
    pkgLocation: Location;
    srcLocation?: Location;
}

export interface Location {
    path: string;
    line: number;
    character: number;
}

export interface Reporter {
    generate(runner: Runner): any;
}
