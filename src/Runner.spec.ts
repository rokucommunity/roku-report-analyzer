import { expect } from 'chai';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { standardizePath as s } from 'brighterscript';
import { Runner } from './Runner';

const tempDir = path.join(process.cwd(), 'temp');
const projectDir = path.join(tempDir, 'project');
const complibDir1 = path.join(tempDir, 'complib1');
const complibDir2 = path.join(tempDir, 'complib2');

describe('Runner', () => {
    let runner: Runner;
    function cwd() {
        return runner.options.cwd;
    }
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
            s`${cwd()}/log1.text`
        ]);
    });
});
