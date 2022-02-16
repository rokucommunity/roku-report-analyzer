import { expect } from 'chai';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { standardizePath as s } from 'brighterscript';
import { Runner } from './Runner';
import * as testUtils from './testUtils.spec';

const tempDir = path.join(process.cwd(), '.tmp');
const projectDir = path.join(tempDir, 'project');
const complibDir1 = path.join(tempDir, 'complib1');
const complibDir2 = path.join(tempDir, 'complib2');

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
        fsExtra.outputFileSync(path.resolve(runner.options.cwd!, logfilePath), contents);
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
        testUtils.createZip({
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
