import * as path from 'path';
import type { FileReference } from './interfaces';
import type { Position } from 'brighterscript';
import type { Runner } from './Runner';
import { util as bscUtil } from 'brighterscript';

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
     * The full text contents of this file
     */
    public fileContents = '';

    /**
     * The list of pkg paths found in the parsed fileContents
     */
    public references: Array<FileReference> = [];

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
        const locations = await this.runner.getOriginalLocations(reference.pkgLocation);
        if (locations?.[0]) {
            //for now, just use the first location found
            reference.srcLocation = locations[0];
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
}
