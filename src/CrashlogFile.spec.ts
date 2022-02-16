import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { CrashlogFile } from './CrashlogFile';
import { standardizePath as s } from 'brighterscript';

describe('CrashlogFile', () => {
    const tempDir = path.join(process.cwd(), '.tmp');
    const filePath = s`${tempDir}/logfile.text`;
    let file: CrashlogFile;
    describe('Runner', () => {
        beforeEach(() => {
            fsExtra.emptydirSync(tempDir);
            file = new CrashlogFile(filePath);
        });
        afterEach(() => {
            fsExtra.emptydirSync(tempDir);
        });

        describe('parse', () => {
            it('does not crash for empty files', () => {
                file.parse(undefined as unknown as string);
                file.parse('');
                file.parse(null as unknown as string);
                file.parse(' ');
            });
        });
    });
});
