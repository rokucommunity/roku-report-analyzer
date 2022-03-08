import * as fsExtra from 'fs-extra';
import * as path from 'path';
import type { FileReference, Location, Reporter } from '../interfaces';
import type { CrashlogFile } from '../CrashlogFile';
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

    private stats = {
        replaced: 0,
        notReplaced: 0
    };

    private get logger() {
        return this.runner.logger;
    }

    public async generate(): Promise<void> {
        await Promise.all(
            this.runner.files.map(x => this.processFile(x))
        );
        this.logger.log('Summary:', this.stats.replaced, 'paths replaced,', this.stats.notReplaced, 'paths not replaced');
    }

    private processFile(file: CrashlogFile) {
        if (file.destPath && this.runner) {
            const contents = this.getFileContents(file);
            const destPath = s`${path.join(this.runner.outDir, file.destPath)}`;
            return fsExtra.outputFile(destPath, contents);
        } else {
            this.logger.error(`Could not compute destPath for "${file.srcPath}"`);
        }
    }

    private getFileContents(file: CrashlogFile) {
        let replaced: FileReference[] = [];
        let notReplaced: FileReference[] = [];
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
                replaced.push(ref);
            } else {
                notReplaced.push(ref);
            }
        }
        this.runner.logger.info(file.destPath + ':', replaced.length, 'paths replaced,', notReplaced.length, 'paths not replaced');
        if (this.logger.isLogLevelEnabled('debug')) {
            for (const ref of replaced) {
                const srcLocation = ref.srcLocation as unknown as Location;
                this.logger.debug('replaced:', `\n\t${ref.pkgLocation.path}:${ref.pkgLocation.line + 1}`, '->', `\n\t${srcLocation.path}:${srcLocation.line + 1}:${srcLocation.character + 1}`);
            }

            for (const ref of notReplaced) {
                const destPath = file.destPath as unknown as string;
                this.logger.debug('not replaced:', `\n\t${ref.pkgLocation.path}:${ref.pkgLocation.line + 1}`, 'at', `\n\t${s`${path.join(this.runner.outDir, destPath)}`}:${ref.range.start.line + 1}:${ref.range.start.character + 1}`);
            }
        }
        this.stats.replaced += replaced.length;
        this.stats.notReplaced += notReplaced.length;
        return contents;
    }
}
