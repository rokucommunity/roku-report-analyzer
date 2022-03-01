import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { util as bscUtil, standardizePath as s } from 'brighterscript';
import { CrashlogFile } from './CrashlogFile';
import { Runner } from './Runner';
import type { RunnerOptions } from './interfaces';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { expectContainSubset } from './testUtils.spec';
import { util } from './util';
const sinon = createSandbox();

describe('CrashlogFile', () => {
    const tempDir = path.join(process.cwd(), '.tmp');
    const filePath = s`${tempDir}/logfile.text`;
    let file: CrashlogFile;
    let runner: Runner;
    let runnerOptions: RunnerOptions;
    beforeEach(() => {
        sinon.restore();
        fsExtra.emptydirSync(tempDir);
        runnerOptions = {
            cwd: tempDir,
            crashlogs: [],
            projects: []
        };
        runner = new Runner(runnerOptions);
        file = new CrashlogFile(runner, filePath);
    });
    afterEach(() => {
        sinon.restore();
        fsExtra.emptydirSync(tempDir);
    });

    it('does not crash with invalid log file name and folder', () => {
        file = new CrashlogFile(runner, 'not/correct/file/path.text');
        expect(file.destPath).to.be.undefined;
    });

    it('does not crash with invalid folder name', () => {
        file = new CrashlogFile(runner, 'not/correct/file/FirstApp_A50');
        expect(file.destPath).to.be.undefined;
    });

    describe('linkReference', () => {
        it('does not crash when zero locations were found', async () => {
            sinon.stub(runner, 'getOriginalLocations').returns(Promise.resolve(undefined) as any);
            //should not crash
            expect(
                await file['linkReference'](undefined as any)
            ).not.to.exist;
        });
    });

    describe('parse', () => {
        it('does not crash for empty files', () => {
            file.parse(undefined as unknown as string);
            file.parse('');
            file.parse(null as unknown as string);
            file.parse(' ');
        });

        it('computes absolute line index', () => {
            file.parse(
                '_____ \npkg:/source/common.brs(1)\n____ pkg:/source/common.brs(2)'
            );
            expectContainSubset(file.references, [{
                offset: 7
            }, {
                offset: 38
            }]);
        });

        it('finds all pkg paths', () => {
            file.parse(`
                Type Mismatch. Unable to cast "Invalid" to "String". (runtime error &h18) in pkg:/source/common.brs(4648)
                Backtrace:
                #1  Function geterroreventanalyticsdata(category As String, subcategory As String, page As String, errorenum As String, servercode As String, message As String, api As String) As Object
                file/line: pkg:/source/common.brs(4648)
                #0  Function onbulkdeleterecordingstatuschange(event As Object) As Void
                file/line: pkg:/components/Screens/Recordings/RecordingsScreen.brs(1101)
                Local Variables:
            `);
            expectContainSubset(file.references, [{
                range: bscUtil.createRange(1, 93, 1, 121),
                pkgLocation: util.createLocation('pkg:/source/common.brs', 4647, 0)
            }, {
                range: bscUtil.createRange(4, 27, 4, 55),
                pkgLocation: util.createLocation('pkg:/source/common.brs', 4647, 0)
            }, {
                range: bscUtil.createRange(6, 27, 6, 88),
                pkgLocation: util.createLocation('pkg:/components/Screens/Recordings/RecordingsScreen.brs', 1100, 0)
            }]);
        });

        it('finds complib paths', () => {
            file.parse(`
                    1 Function evaluateautohidecontrols(event As Object) As Void; pkg:   file/line: complib1:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1161)
                    ____________________________________________________

                    count       Hardware Platform
                    --------------------------------
                            1   FtWorth,OEM=TCL,Brand=TCL


                    count       Application Version
                    -----------------------------
                            1   4.8.1201


                    Stack Trace
                    -------------------------------------------------


                Execution timeout (runtime error &h23) in complib2:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1151)
                Backtrace:
                #0  Function evaluateautohidecontrols(event As Object) As Void
                    file/line: vendorcomplib:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1148)
                Local Variables:
                event            roSGNodeEvent refcnt=2
                global           Interface:ifGlobal
                m                roAssociativeArray refcnt=2 count:86
                timesincelastkeypress <uninitialized>
                currentstate     <uninitialized>
                threshold        <uninitialized>
            `);
            expectContainSubset(file.references, [{
                range: bscUtil.createRange(1, 100, 1, 166),
                pkgLocation: util.createLocation('complib1:/components/Screens/PlaybackUltra/PlaybackUltra.brs', 1160, 0)
            }, {
                range: bscUtil.createRange(18, 58, 18, 124),
                pkgLocation: util.createLocation('complib2:/components/Screens/PlaybackUltra/PlaybackUltra.brs', 1150, 0)
            }, {
                range: bscUtil.createRange(21, 31, 21, 102),
                pkgLocation: util.createLocation('vendorcomplib:/components/Screens/PlaybackUltra/PlaybackUltra.brs', 1147, 0)
            }]);
        });
    });

    describe('process', () => {
        it('keeps running when no sourcemaps were found', async () => {
            file.parse(`
                pkg:/source/main.brs(100)
            `);
            await file.process();
            expect(file.references[0].srcLocation).not.to.exist;
        });
    });
});
