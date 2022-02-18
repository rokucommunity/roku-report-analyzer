import type { FileReference } from './interfaces';
import type { Runner } from './Runner';
import { util as bscUtil } from 'brighterscript';

export class CrashlogFile {
    public constructor(
        public runner: Runner,
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

    /**
     * Link every reference with its original location
     */
    public async process() {
        await Promise.all(
            this.references.map(x => this.linkReference(x))
        );
    }

    private async linkReference(reference: FileReference) {
        const locations = await this.runner.getOriginalLocations(reference.pkgLocation);
        if (locations?.[0]) {
            //for now, just use the first location found
            reference.srcLocation = locations[0];
        }
    }

    private findPkgPaths(line: string, lineIndex: number) {
        const pattern = /(\w+:\/.*?)\((\d+)\)/g;
        let match: RegExpExecArray | null;
        // eslint-disable-next-line no-cond-assign
        while (match = pattern.exec(line)) {
            this.references.push({
                range: bscUtil.createRange(lineIndex, match.index, lineIndex, match.index + match[0].length),
                pkgLocation: {
                    path: match[1],
                    line: parseInt(match[2]),
                    character: 0
                }
            });
        }
    }
}
