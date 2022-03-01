import * as fsExtra from 'fs-extra';
import * as path from 'path';

import type { CrashlogFile } from '../CrashlogFile';
import type { Reporter } from '../interfaces';
import type { Runner } from '../Runner';
import { standardizePath as s } from 'brighterscript';

/**
 * Converts the file path and line numbers to the original locations (leveraging sourcemaps)
 */
export class StandardReporter implements Reporter {
    public constructor(
        private runner: Runner
    ) {

    }

    public generate(): Promise<void[]> {
        return Promise.all(
            this.runner.files.map(x => this.processFile(x))
        );
    }

    private processFile(file: CrashlogFile) {
        if (file.destPath && this.runner) {
            const contents = this.getFileContents(file);
            const destPath = path.join(this.runner.outDir, file.destPath);
            return fsExtra.outputFile(destPath, contents);
        } else {
            console.error(`Could not compute destPath for "${file.srcPath}"`);
        }
    }

    private getFileContents(file: CrashlogFile) {
        let contents = file.fileContents;
        //walk the references backwards and replace the file contents
        for (const ref of [...file.references].reverse()) {
            //if the reference has a mapped source location
            if (ref.srcLocation) {
                contents =
                    contents.substring(0, ref.offset) +
                    s`${ref.srcLocation.path}` +
                    `(${ref.srcLocation.line + 1})` +
                    contents.substring(ref.offset + ref.length);
            }
        }
        return contents;
    }
}
