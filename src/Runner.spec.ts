import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as testUtils from './testUtils.spec';
import { Runner } from './Runner';
import { SourceNode } from 'source-map';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { expectFileEquals } from './testUtils.spec';
import logger from '@rokucommunity/logger';
import { standardizePath as s } from 'brighterscript';

const sinon = createSandbox();
const tempDir = path.join(process.cwd(), '.tmp');
const projectDir = path.join(tempDir, 'project');
const zipPath = s`${tempDir}/logs.zip`;

describe('Runner', () => {
    let runner: Runner;

    beforeEach(() => {
        sinon.restore();
        logger.logLevel = 'off';
        fsExtra.emptydirSync(tempDir);
        runner = new Runner({
            cwd: tempDir,
            crashlogs: ['crashlog'],
            projects: [projectDir]
        });
    });
    afterEach(() => {
        sinon.restore();
        fsExtra.emptydirSync(tempDir);
    });

    function addLogfile(logfilePath: string, contents: string) {
        runner.options.crashlogs.push(logfilePath);
        fsExtra.outputFileSync(path.resolve(runner.cwd, logfilePath), contents);
    }

    it('throws on empty crashlogs array', () => {
        expect(() => {
            runner = new Runner({
                cwd: tempDir,
                crashlogs: [],
                projects: [projectDir]
            });
        }).to.throw('crashlogs list may not be empty');
    });

    it('uses process.cwd() when not specified', () => {
        runner = new Runner({
            projects: [projectDir],
            crashlogs: [''],
            cwd: undefined
        });
        expect(runner.cwd).to.eql(process.cwd());
    });

    it('defaults outDir to "dist"', () => {
        expect(runner.outDir).to.eql(
            s`${runner.cwd}/dist`
        );
    });

    it('uses overridden outDir', () => {
        runner = new Runner({
            projects: [projectDir],
            crashlogs: ['crashlog'],
            outDir: 'out'
        });
        expect(runner.outDir).to.eql(
            s`${runner.cwd}/out`
        );
    });

    it(`avoids crash for null projects array`, async () => {
        runner = new Runner({
            projects: undefined as unknown as [],
            crashlogs: ['crashlog']
        });
        //shouldn't crash
        await runner['loadProjects']();
    });

    it('finds text log files', async () => {
        addLogfile('log1.text', '');
        await runner.run();
        expect(
            runner['files'].map(x => s`${x.srcPath}`)
        ).to.eql([
            s`${runner.cwd}/log1.text`
        ]);
    });

    it('finds logs zip, extracts, and then adds all files', async () => {
        await testUtils.createZip({
            'log1.text': 'a',
            'subdir1/log2.txt': 'b',
            'subdir1/subdir2/log3.txt': 'c'
        }, zipPath);
        runner.options.crashlogs.push(zipPath);
        await runner.run();
        expect(
            runner['files'].map(x => s`${x.srcPath}`)
        ).to.eql([
            s`${runner.outDir}/.tmp/logs.zip/log1.text`,
            s`${runner.outDir}/.tmp/logs.zip/subdir1/log2.txt`,
            s`${runner.outDir}/.tmp/logs.zip/subdir1/subdir2/log3.txt`
        ]);
    });

    describe('process', () => {
        it('writes files to correct locations', async () => {
            //file with no contents
            addLogfile('OScrashes-2021-01-01/FirstApp_A50.text', '');
            addLogfile('OScrashes-2022-01-01/FirstApp_A47.text', 'pkg:/source/main.brs(1)');
            addLogfile('OScrashes-2023-01-01/SecondApp_A47.text', 'pkg:/source/main.brs(2)');
            await runner.run();

            expectFileEquals(`${runner.outDir}/FirstApp/2021-01-01-A50.text`, '');
            expectFileEquals(`${runner.outDir}/FirstApp/2022-01-01-A47.text`, 'pkg:/source/main.brs(1)');
            expectFileEquals(`${runner.outDir}/SecondApp/2023-01-01-A47.text`, 'pkg:/source/main.brs(2)');
        });

        it('replaces pkg paths with source paths without sourcemaps', async () => {
            addLogfile('OScrashes-2021-01-01/FirstApp_A50.text', `
                pkg:/source/main.brs(1)
                pkg:/source/main.brs(14)
            `);

            //the file just needs to exist
            fsExtra.outputFileSync(`${projectDir}/source/main.brs`, '');

            await runner.run();
            expectFileEquals(`${runner.outDir}/FirstApp/2021-01-01-A50.text`, `
                ${s`${projectDir}/source/main.brs(1)`}
                ${s`${projectDir}/source/main.brs(14)`}
            `);
        });

        it('replaces pkg paths with source paths using sourcemaps', async () => {
            addLogfile('OScrashes-2021-01-01/FirstApp_A50.text', `
                pkg:/source/main.brs(1)
                pkg:/source/main.brs(2)
            `);

            const map = new SourceNode(null, null, null, [
                //line 1 maps to line 5
                new SourceNode(5, 0, '../../src/source/main.bs', 'explode = 1/0'),
                '\n',
                //line 2 maps to line 10
                new SourceNode(10, 0, '../../src/source/main.bs', 'explode = 2/0')
            ]).toStringWithSourceMap().map;

            //the file just needs to exist
            fsExtra.outputJsonSync(`${projectDir}/source/main.brs.map`, map);

            await runner.run();
            expectFileEquals(`${runner.outDir}/FirstApp/2021-01-01-A50.text`, `
                ${s`${tempDir}/src/source/main.bs(5)`}
                ${s`${tempDir}/src/source/main.bs(10)`}
            `);
        });

        it('replaces pkg paths with source paths using sourcemaps', async () => {
            addLogfile('OScrashes-2021-01-01/FirstApp_A50.text', `
                pkg:/source/main.brs(1)
                pkg:/source/main.brs(2)
            `);

            const map = new SourceNode(null, null, null, [
                //line 1 maps to line 5
                new SourceNode(5, 0, s`${tempDir}/src/source/main.bs`, 'explode = 1/0'),
                '\n',
                //line 2 maps to line 10
                new SourceNode(10, 0, s`${tempDir}/src/source/main.bs`, 'explode = 2/0')
            ]).toStringWithSourceMap().map;

            //the file just needs to exist
            fsExtra.outputJsonSync(`${projectDir}/source/main.brs.map`, map);

            await runner.run();
            expectFileEquals(`${runner.outDir}/FirstApp/2021-01-01-A50.text`, `
                ${s`${tempDir}/src/source/main.bs(5)`}
                ${s`${tempDir}/src/source/main.bs(10)`}
            `);
        });

        it('trigger logger.debug for replaced and notReplaced file entries in StandardReporter', async () => {
            //this test is just to help with code coverage
            logger.logLevel = 'debug';
            runner.logger = logger;
            sinon.stub(logger, 'write').callsFake(() => { });
            addLogfile('OScrashes-2022-01-01/FirstApp_A47.text', 'pkg:/source/main.brs(1)');
            addLogfile('OScrashes-2022-01-01/FirstApp_A48.text', 'libpkg:/source/main.brs(1)');
            fsExtra.outputFileSync(`${projectDir}/source/main.brs`, '');
            await runner.run();
        });
    });
});
