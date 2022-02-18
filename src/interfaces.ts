import type { Range } from 'brighterscript';

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

export interface FileReference {
    /**
     * The location in the log where this file reference is located
     */
    range: Range;
    pkgLocation: Location;
    srcLocation?: Location;
}

export interface Location {
    path: string;
    line: number;
    character: number;
}
