import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as testUtils from './testUtils.spec';
import { Runner } from './Runner';
import { expect } from 'chai';
import { standardizePath as s } from 'brighterscript';

const tempDir = path.join(process.cwd(), '.tmp');
const projectDir = path.join(tempDir, 'project');

describe('Runner', () => {
    let runner: Runner;

    beforeEach(() => {
        fsExtra.emptydirSync(tempDir);
        runner = new Runner({
            cwd: tempDir,
            crashlogs: [],
            project: projectDir
        });
    });
    afterEach(() => {
        fsExtra.emptydirSync(tempDir);
    });

    function addLogfile(logfilePath: string, contents: string) {
        runner.options.crashlogs.push(logfilePath);
        fsExtra.outputFileSync(path.resolve(runner.cwd, logfilePath), contents);
    }

    it('finds text log files', async () => {
        addLogfile('log1.text', '');
        await runner.run();
        expect(
            runner['crashlogFiles'].map(x => s`${x.logfilePath}`)
        ).to.eql([
            s`${runner.cwd}/log1.text`
        ]);
    });

    it('finds logs zip, extracts, and then adds all files', async () => {
        const zipPath = s`${tempDir}/logs.zip`;
        await testUtils.createZip({
            'log1.text': 'a',
            'subdir1/log2.txt': 'b',
            'subdir1/subdir2/log3.txt': 'c'
        }, zipPath);
        runner.options.crashlogs.push(zipPath);
        await runner.run();
        expect(
            runner['crashlogFiles'].map(x => s`${x.logfilePath}`)
        ).to.eql([
            s`${runner.outDir}/logs.zip/log1.text`,
            s`${runner.outDir}/logs.zip/subdir1/log2.txt`,
            s`${runner.outDir}/logs.zip/subdir1/subdir2/log3.txt`
        ]);
    });
});
