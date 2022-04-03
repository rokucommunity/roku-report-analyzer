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


export interface CrashReport {
    /**
     * The error message as it appears right before the backtrace.
     * @example "Execution timeout (runtime error &h23) in complib2:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1151)"
    */
    errorMessage: string;
    /**
     * The stack trace in reverse scope order.
    */
    stackFrame: StackFrame[];
    /**
     * Each one of the local variables and their metadata
    */
    localVariables: LocalVariable[];
    applicationVersions: ApplicationVersionCount[];
    /**
     * The count information for each of the hardware platforms
    */
    count: {
        total: number;
        details: Array < { count: number; hardwarePlatform: string } >;
    };
}

export interface Location {
    path: string;
    line: number;
    character: number;
}

export interface Reporter {
    generate(runner: Runner): any;
}

export interface StackFrame {
    /**
     * The scope level where the error occurred.
     * @example Function startPlayback() As Void
    */
    scope: string;
    /**
     * Pointer to the `FileReference` in `CrashlogFile.references` that contains the location of the error.
     * `undefined` if not found in `CrashlogFile.references`.
    */
    reference: FileReference | undefined;
}

export interface LocalVariable {
    name: string;
    /**
     * The additional data that is available for the variable.
     * @example "roAssociativeArray refcnt=3 count:67"
     */
    // For now just use the raw value. Maybe we can parse this further later.
    metadata: string;
}

export interface ApplicationVersion {
    major: number;
    minor: number;
    build: number;
}

/**
 * Represents the amount of crashes for each application version.
 */
export interface ApplicationVersionCount {
    count: number;
    version: ApplicationVersion | undefined;
    /**
     * The application version as it appears on the crashlog.
     * Useful when the version is not parsable.
     * @example "ver2"
    */
    rawVersion: string;
}
