import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { util as bscUtil, standardizePath as s } from 'brighterscript';
import { CrashlogFile } from './CrashlogFile';
import { expect } from 'chai';

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

            it('finds all pkg paths', () => {
                file.parse(`
                    Type Mismatch. Unable to cast "Invalid" to "String". (runtime error &h18) in pkg:/source/common.brs(4648)
                    Backtrace:
                    #1  Function geterroreventanalyticsdata(category As String, subcategory As String, page As String, errorenum As String, servercode As String, message As String, api As String) As Object
                    file/line: pkg:/source/common.brs(4648)
                    #0  Function onbulkdeleterecordingstatuschange(event As Object) As Void
                    file/line: pkg:/components/Screens/Recordings/RecordingsScreen.brs(1100)
                    Local Variables:
                `);
                expect(file.references).to.eql([{
                    range: bscUtil.createRange(1, 97, 1, 125),
                    line: 4648,
                    pkgPath: 'pkg:/source/common.brs'
                }, {
                    range: bscUtil.createRange(4, 31, 4, 59),
                    line: 4648,
                    pkgPath: 'pkg:/source/common.brs'
                }, {
                    range: bscUtil.createRange(6, 31, 6, 92),
                    line: 1100,
                    pkgPath: 'pkg:/components/Screens/Recordings/RecordingsScreen.brs'
                }]);
            });

            it('finds complib paths', () => {
                file.parse(`
                        1 Function evaluateautohidecontrols(event As Object) As Void; pkg:   file/line: complib1:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1160)
                        ____________________________________________________

                        count       Hardware Platform
                        --------------------------------
                                1   FtWorth,OEM=TCL,Brand=TCL


                        count       Application Version
                        -----------------------------
                                1   4.8.1201


                        Stack Trace
                        -------------------------------------------------


                    Execution timeout (runtime error &h23) in complib2:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1159)
                    Backtrace:
                    #0  Function evaluateautohidecontrols(event As Object) As Void
                        file/line: vendorcomplib:/components/Screens/PlaybackUltra/PlaybackUltra.brs(1160)
                    Local Variables:
                    event            roSGNodeEvent refcnt=2
                    global           Interface:ifGlobal
                    m                roAssociativeArray refcnt=2 count:86
                    timesincelastkeypress <uninitialized>
                    currentstate     <uninitialized>
                    threshold        <uninitialized>
                `);
                expect(file.references).to.eql([{
                    range: bscUtil.createRange(1, 104, 1, 170),
                    line: 1160,
                    pkgPath: 'complib1:/components/Screens/PlaybackUltra/PlaybackUltra.brs'
                }, {
                    range: bscUtil.createRange(18, 62, 18, 128),
                    line: 1159,
                    pkgPath: 'complib2:/components/Screens/PlaybackUltra/PlaybackUltra.brs'
                }, {
                    range: bscUtil.createRange(21, 35, 21, 106),
                    line: 1160,
                    pkgPath: 'vendorcomplib:/components/Screens/PlaybackUltra/PlaybackUltra.brs'
                }]);
            });
        });
    });
});
