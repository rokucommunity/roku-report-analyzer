import type { Range } from 'brighterscript';
import { util as bscUtil } from 'brighterscript';
export class CrashlogFile {
    public constructor(
        /**
         * The path to the original source file
         */
        public srcPath: string
    ) { }

    /**
     * The full text contents of this file
     */
    public fileContents = '';

    /**
     * The list of pkg paths found in the parsed fileContents
     */
    public references: Array<FileReference> = [];

    public parse(fileContents: string) {
        this.fileContents = fileContents;
        const lines = fileContents?.split(/\r?\n/) ?? [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.findPkgPaths(line, i);
        }
    }

    private findPkgPaths(line: string, lineIndex: number) {
        const pattern = /(\w+:\/.*?)\((\d+)\)/g;
        let match: RegExpExecArray | null;
        // eslint-disable-next-line no-cond-assign
        while (match = pattern.exec(line)) {
            this.references.push({
                range: bscUtil.createRange(lineIndex, match.index, lineIndex, match.index + match[0].length),
                pkgPath: match[1],
                line: parseInt(match[2])
            });
        }
    }
}

interface FileReference {
    /**
     * The location in the log where this file reference is located
     */
    range: Range;
    /**
     * The pkgPath referenced by this entry
     */
    pkgPath: string;
    /**
     * The line of source code referenced by this entry
     */
    line: number;
}
