import * as path from 'path';
import type { ApplicationVersionCount, CrashReport, FileReference, LocalVariable, StackFrame } from './interfaces';
import { util as bscUtil, standardizePath } from 'brighterscript';
import type { Position } from 'brighterscript';
import type { Runner } from './Runner';

export class CrashlogFile {
    public constructor(
        public runner: Runner,
        /**
         * The path to the original source file
         */
        public srcPath: string
    ) {
        this.computeDestPath();
    }

    /**
     * The path (relative to outDir) where the processed version of this file should be written
     */
    public destPath: string | undefined;

    /**
     * The date where the crashes occurred
    */
    public date: string | undefined;

    /**
     * The full text contents of this file
     */
    public fileContents = '';

    /**
     * The list of pkg paths found in the parsed fileContents
     */
    public references: Array<FileReference> = [];

    public crashes: Array<CrashReport> = [];

    /**
     * Compute the dest path of this log file
     */
    private computeDestPath() {
        let logFileName = path.basename(this.srcPath);
        const dateFolderName = path.dirname(this.srcPath);
        const ext = path.extname(logFileName);
        //remove extension
        logFileName = logFileName.substring(0, logFileName.length - ext.length);
        const firmwareSeparatorPosition = logFileName.lastIndexOf('_');
        if (firmwareSeparatorPosition > -1) {
            const appName = logFileName.substring(0, firmwareSeparatorPosition);
            const firmware = logFileName.substring(firmwareSeparatorPosition + 1);
            const date = /oscrashes.(\d\d\d\d-\d\d-\d\d)/i.exec(dateFolderName)?.[1];
            if (date) {
                this.destPath = `${appName}/${date}-${firmware}${ext}`;
                this.date = date;
            }
        }
    }


    /**
     * Convert a position into an offset from the start of the file
     */
    private positionToOffset(position: Position) {
        //create the line/offset map if not yet created
        if (!this.lineOffsetMap) {
            this.lineOffsetMap = {};
            this.lineOffsetMap[0] = 0;
            const regexp = /(\r?\n)/g;
            let lineIndex = 1;
            let match: RegExpExecArray | null;
            // eslint-disable-next-line no-cond-assign
            while (match = regexp.exec(this.fileContents)) {
                this.lineOffsetMap[lineIndex++] = match.index + match[1].length;
            }
        }
        return this.lineOffsetMap[position.line] + position.character;
    }
    private lineOffsetMap!: Record<number, number>;

    public parse(fileContents: string) {
        this.fileContents = fileContents;
        const lines = fileContents?.split(/\r?\n/) ?? [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.findPkgPaths(line, i);
        }

        this.parseCrashes();
    }

    private parseCrashes() {
        this.crashes = [];
        let contents = this.fileContents;

        let crashReportBlocks = contents?.split(/\s*___+\s*/) ?? [];

        // Filter out crash reports without stack trace
        crashReportBlocks = crashReportBlocks.filter(block => !block.includes('StackTrace missing'));

        crashReportBlocks.forEach(crashReportBlock => {
            const crashReportBlockSections: Array<{ sectionType: CrashReportSectionType; lines: string[] }> = [];
            const blockLines = crashReportBlock.split(/\r?\n+/).map(x => x.trim());

            // Separate the block in three sections:
            // Hardware Platform, Application Version, and Stack Trace
            let currentSection: CrashReportSectionType | undefined;
            let foundSectionHeader = false;
            for (const line of blockLines) {
                if (/\s*count\s+Hardware Platform/.test(line)) {
                    currentSection = CrashReportSectionType.HardwarePlatform;
                    foundSectionHeader = true;
                } else if (/\s*count\s+Application Version/.test(line)) {
                    currentSection = CrashReportSectionType.ApplicationVersion;
                    foundSectionHeader = true;
                } else if (/\s*Stack Trace/.test(line)) {
                    currentSection = CrashReportSectionType.StackTrace;
                    foundSectionHeader = true;
                } else {
                    if (foundSectionHeader && currentSection && !/\s*---+\s*/.exec(line)) {
                        let crashReportSectionIndex = crashReportBlockSections.findIndex(x => x.sectionType === currentSection);

                        if (crashReportSectionIndex === -1) {
                            crashReportBlockSections.push({
                                sectionType: currentSection,
                                lines: [line]
                            });
                        } else {
                            crashReportBlockSections[crashReportSectionIndex].lines.push(line);
                        }
                    }
                }
            }

            // Skip processing blocks without sections, e.g: everything before the first crash
            if (crashReportBlockSections.length === 0) {
                return;
            }

            let crashReport: CrashReport = {
                applicationVersions: [],
                errorMessage: '',
                stackFrame: [],
                localVariables: [],
                count: {
                    total: 0,
                    details: []
                }
            };

            // Process each block section
            for (const crashReportSection of crashReportBlockSections) {
                switch (crashReportSection.sectionType) {
                    case CrashReportSectionType.HardwarePlatform:
                        crashReport.count.details = this.parseHardwarePlatformSection(crashReportSection.lines);
                        break;
                    case CrashReportSectionType.ApplicationVersion:
                        const applicationVersions = this.parseApplicationVersionSection(crashReportSection.lines);
                        crashReport.applicationVersions = applicationVersions;
                        crashReport.count.total = applicationVersions.reduce((acc, curr) => acc + curr.count, 0);
                        break;
                    case CrashReportSectionType.StackTrace:
                        const { errorMessage, stackFrame: stackTrace, localVariables } = this.parseStackTraceSection(crashReportSection.lines);
                        crashReport.errorMessage = errorMessage;
                        crashReport.stackFrame = stackTrace;
                        crashReport.localVariables = localVariables;
                        break;
                }
            }

            this.crashes.push(crashReport);
        });
    }

    /**
     * Link every reference with its original location
     */
    public async process() {
        await Promise.all(
            this.references.map(x => this.linkReference(x))
        );
    }

    /**
     * Look up the source location for each reference (using sourcemaps)
     */
    private async linkReference(reference: FileReference) {
        const locations = await this.runner.getOriginalLocations(reference?.pkgLocation);
        const firstLocation = locations?.[0];

        if (firstLocation) {
            //for now, just use the first location found
            reference.srcLocation = firstLocation;
        }
    }

    /**
     * Scan the text and find all pkg paths
     */
    private findPkgPaths(line: string, lineIndex: number) {
        const pattern = /(\w+:\/.*?)\((\d+)\)/g;
        let match: RegExpExecArray | null;
        // eslint-disable-next-line no-cond-assign
        while (match = pattern.exec(line)) {
            const range = bscUtil.createRange(lineIndex, match.index, lineIndex, match.index + match[0].length);
            this.references.push({
                range: range,
                offset: this.positionToOffset(range.start),
                length: match[0].length,
                pkgLocation: {
                    path: match[1],
                    //roku prints 1-based lines, but we store them as 0-based
                    line: parseInt(match[2]) - 1,
                    character: 0
                }
            });
        }
    }

    /**
     * Parses the hardware platform section.
     * Extracts the crash count for each platform.
    */
    public parseHardwarePlatformSection(sectionLines: string[]): CrashReport['count']['details'] {
        return sectionLines.filter(l => l !== '').map(line => {
            const [count, ...platformAsArray] = line.split(/\s+/);
            const platformCodeName = platformAsArray.join(' ').trim();
            return {
                count: parseInt(count),
                hardwarePlatform: platformCodeName
            };
        });
    }

    /**
     * Parses the application version section.
     * Extracts the crash count for each application version.
    */
    public parseApplicationVersionSection(lines: string[]): ApplicationVersionCount[] {
        const applicationVersions = lines.filter(l => l !== '').map(line => {
            const count = line.split(/\s+/)[0];
            const rawVersion = line.substring(count.length).trim();
            const splittedVersion = rawVersion.split(/\.|,|;/);

            let version;
            if (splittedVersion.length === 3 && splittedVersion.every(x => Number.isInteger(Number(x)))) {
                version = { major: parseInt(splittedVersion[0]), minor: parseInt(splittedVersion[1]), build: parseInt(splittedVersion[2]) };
            }

            return { count: parseInt(count), version: version, rawVersion: rawVersion } as ApplicationVersionCount;
        });

        return applicationVersions;
    }

    /**
     * Parses the stack trace section.
     * Extracts the error message, the backtrace and the local variables of the crash.
    */
    public parseStackTraceSection(lines: string[]): ParsedStackTraceSection {
        const parsedStackTraceSection: ParsedStackTraceSection = {
            errorMessage: '',
            stackFrame: [],
            localVariables: []
        };

        lines = lines.filter(l => l !== '');

        if (lines.length === 0) {
            return { errorMessage: '', stackFrame: [], localVariables: [] };
        }

        const firstLine = lines[0];

        // In case the error message is missing
        if (firstLine === 'Local Variables:' || firstLine === 'Backtrace:') {
            parsedStackTraceSection.errorMessage = '';
        } else {
            parsedStackTraceSection.errorMessage = firstLine;
            lines.shift();
        }

        const stackTraceSections: Array<{ sectionType: StackTraceSectionType; lines: string[] }> = [];

        let currentSection: StackTraceSectionType | undefined;
        let foundSectionHeader = false;

        // Separate the block in two sections: Backtrace and LocalVariables
        for (const line of lines) {
            if (line === 'Local Variables:') {
                currentSection = StackTraceSectionType.LocalVariables;
                foundSectionHeader = true;
            } else if (line === 'Backtrace:') {
                currentSection = StackTraceSectionType.BackTrace;
                foundSectionHeader = true;
            } else {
                if (foundSectionHeader && currentSection) {
                    let sectionIndex = stackTraceSections.findIndex(x => x.sectionType === currentSection);
                    if (sectionIndex === -1) {
                        stackTraceSections.push({
                            sectionType: currentSection,
                            lines: [line]
                        });
                    } else {
                        stackTraceSections[sectionIndex].lines.push(line);
                    }
                }
            }
        }

        // Process each section
        for (const stackTraceSection of stackTraceSections) {
            switch (stackTraceSection.sectionType) {
                case StackTraceSectionType.LocalVariables:
                    parsedStackTraceSection.localVariables = this.parseStackTraceLocalVariables(stackTraceSection.lines);
                    break;
                case StackTraceSectionType.BackTrace:
                    parsedStackTraceSection.stackFrame = this.parseStackFrames(stackTraceSection.lines);
                    break;
            }
        }

        return parsedStackTraceSection;
    }

    /**
     * Parses the stack frames.
     * Extracts the scope and location of each stack frame.
    */
    public parseStackFrames(lines: string[]): StackFrame[] {
        const backtrace: StackFrame[] = [];

        let stackFrame: StackFrame = { scope: '', pkgLocation: { path: '', line: 0, character: 0 } };

        for (const line of lines) {
            if (line === '') {
                continue;
            }
            if (/#[0-9]+\s+./.exec(line)) {
                const [_, ...scopeAsArray] = line.split(/\s+/);
                stackFrame.scope = scopeAsArray.join(' ').trim();
            } else if (/file\/line:\s+./.exec(line)) {
                const [_, ...pkgLocationAsArray] = line.split(/\s+/);

                const pattern = /(\w+:\/.*?)\((\d+)\)/g;
                const match = pattern.exec(pkgLocationAsArray.join(' ').trim());
                if (match) {
                    stackFrame.pkgLocation = {
                        path: match[1],
                        line: parseInt(match[2]) - 1,
                        character: 0
                    };

                    backtrace.push({ ...stackFrame }); // Shallow copy to avoid object reference problem.
                }
            }
        }

        return backtrace;
    }

    /**
     * Parses the local variables section.
     * Extracts the local variables and their metadata.
    */
    public parseStackTraceLocalVariables(lines: string[]): LocalVariable[] {
        const localVariables: LocalVariable[] = [];

        for (const line of lines) {
            if (line === '') {
                continue;
            }
            const [name, ...metadataAsArray] = line.split(/\s+/);
            const metadata = metadataAsArray.join(' ').trim();

            localVariables.push({ name: name, metadata: metadata });
        }

        return localVariables;
    }
}

enum CrashReportSectionType {
    HardwarePlatform = 'HardwarePlatform',
    ApplicationVersion = 'ApplicationVersion',
    StackTrace = 'StackTrace'
}

enum StackTraceSectionType {
    BackTrace = 'BackTrace',
    LocalVariables = 'LocalVariables'
}

interface ParsedStackTraceSection {
    errorMessage: string;
    stackFrame: StackFrame[];
    localVariables: LocalVariable[];
}
