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
            crashlogs: ['crashlogs'],
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

    describe('parseCrashes', () => {
        it('empty section', () => {
            expect(file.parseHardwarePlatformSection([])).to.be.empty;
            expect(file.parseHardwarePlatformSection(['', ''])).to.be.empty;
            expect(file.parseHardwarePlatformSection(['', '', ''])).to.be.empty;
        });

        describe('parses the application version section', () => {
            it('empty section', () => {
                expect(file.parseApplicationVersionSection([])).to.eql([]);
                expect(file.parseApplicationVersionSection([''])).to.eql([]);
                expect(file.parseApplicationVersionSection(['', ''])).to.eql([]);
            });

            it('normal versions', () => {
                expect(file.parseApplicationVersionSection([
                    '1\t3.6.5',
                    '2\t0,0,1',
                    '5\t4;2;0',
                    '3\t2.6.590'
                ])).to.eql(
                    [
                        {
                            count: 1,
                            version: { major: 3, minor: 6, build: 5 },
                            rawVersion: '3.6.5'
                        },
                        {
                            count: 2,
                            version: { major: 0, minor: 0, build: 1 },
                            rawVersion: '0,0,1'
                        },
                        {
                            count: 5,
                            version: { major: 4, minor: 2, build: 0 },
                            rawVersion: '4;2;0'
                        },
                        {
                            count: 3,
                            version: { major: 2, minor: 6, build: 590 },
                            rawVersion: '2.6.590'
                        }
                    ]
                );
            });

            it('unparsable versions', () => {
                expect(file.parseApplicationVersionSection([
                    '1\t3 6 5',
                    '2\t0\t0\t1',
                    '5\tver4.2.0',
                    '3\t2.6.590-hotfix',
                    '1\ta.4.6'
                ])).to.eql(
                    [
                        {
                            count: 1,
                            version: undefined,
                            rawVersion: '3 6 5'
                        },
                        {
                            count: 2,
                            version: undefined,
                            rawVersion: '0\t0\t1'
                        },
                        {
                            count: 5,
                            version: undefined,
                            rawVersion: 'ver4.2.0'
                        },
                        {
                            count: 3,
                            version: undefined,
                            rawVersion: '2.6.590-hotfix'
                        },
                        {
                            count: 1,
                            version: undefined,
                            rawVersion: 'a.4.6'
                        }
                    ]
                );
            });
        });

        describe('parses the stack trace section', () => {
            it('empty section', () => {
                expectContainSubset(file.parseStackTraceSection([]), { errorMessage: '', stackFrame: [], localVariables: [] });
                expectContainSubset(file.parseStackTraceSection(['']), { errorMessage: '', stackFrame: [], localVariables: [] });
                expectContainSubset(file.parseStackTraceSection(['', '']), { errorMessage: '', stackFrame: [], localVariables: [] });
            });

            it('no error message', () => {
                const section = [
                    'Backtrace:',
                    '#1  Function doupdatecaptionsmode() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    '#0  Function onfullscreenanimationfinished() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(741)',
                    'Local Variables:',
                    'global           Interface:ifGlobal',
                    'm                roAssociativeArray refcnt=3 count:67',
                    'ccsetting        roString refcnt=1 val:"On"'
                ];

                expectContainSubset(file.parseStackTraceSection(section), {
                    errorMessage: '',
                    stackFrame: [
                        {
                            scope: 'Function doupdatecaptionsmode() As Void',
                            // Can't get the reference if parse() has not been called.
                            reference: undefined
                        },
                        {
                            scope: 'Function onfullscreenanimationfinished() As Void',
                            reference: undefined
                        }
                    ],
                    localVariables: [
                        {
                            name: 'global',
                            metadata: 'Interface:ifGlobal'
                        },
                        {
                            name: 'm',
                            metadata: 'roAssociativeArray refcnt=3 count:67'
                        },
                        {
                            name: 'ccsetting',
                            metadata: 'roString refcnt=1 val:"On"'
                        }
                    ]
                });
            });

            it('no backtrace', () => {
                const section = [
                    'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    'Local Variables:',
                    'global           Interface:ifGlobal',
                    'm                roAssociativeArray refcnt=3 count:67',
                    'ccsetting        roString refcnt=1 val:"On"'
                ];

                expectContainSubset(file.parseStackTraceSection(section), {
                    errorMessage: 'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    stackFrame: [],
                    localVariables: [
                        {
                            name: 'global',
                            metadata: 'Interface:ifGlobal'
                        },
                        {
                            name: 'm',
                            metadata: 'roAssociativeArray refcnt=3 count:67'
                        },
                        {
                            name: 'ccsetting',
                            metadata: 'roString refcnt=1 val:"On"'
                        }
                    ]
                });
            });

            it('no local variables', () => {
                const section = [
                    'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    'Backtrace:',
                    '#1  Function doupdatecaptionsmode() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    '#0  Function onfullscreenanimationfinished() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(741)'
                ];

                expectContainSubset(file.parseStackTraceSection(section), {
                    errorMessage: 'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    stackFrame: [
                        {
                            scope: 'Function doupdatecaptionsmode() As Void',
                            // Can't get the reference if parse() has not been called.
                            reference: undefined
                        },
                        {
                            scope: 'Function onfullscreenanimationfinished() As Void',
                            reference: undefined
                        }
                    ],
                    localVariables: []
                });
            });

            it('normal section', () => {
                const section = [
                    'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    'Backtrace:',
                    '#1  Function doupdatecaptionsmode() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    '#0  Function onfullscreenanimationfinished() As Void',
                    'file/line: pkg:/components/playerscreen/PlayerScreen.brs(741)',
                    'Local Variables:',
                    'global           Interface:ifGlobal',
                    'm                roAssociativeArray refcnt=3 count:67',
                    'ccsetting        roString refcnt=1 val:"On"'
                ];

                expectContainSubset(file.parseStackTraceSection(section), {
                    errorMessage: 'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                    stackFrame: [
                        {
                            scope: 'Function doupdatecaptionsmode() As Void',
                            // Can't get the reference if parse() has not been called.
                            reference: undefined
                        },
                        {
                            scope: 'Function onfullscreenanimationfinished() As Void',
                            reference: undefined
                        }
                    ],
                    localVariables: [
                        {
                            name: 'global',
                            metadata: 'Interface:ifGlobal'
                        },
                        {
                            name: 'm',
                            metadata: 'roAssociativeArray refcnt=3 count:67'
                        },
                        {
                            name: 'ccsetting',
                            metadata: 'roString refcnt=1 val:"On"'
                        }
                    ]
                });
            });
        });

        it('structures crashes correctly', () => {
            file.parse(`
                18 \tFunction doupdatecaptionsmode() As Void; pkg:/components/playerscreen/PlayerScreen.brs(2941)
                ____________________________________________________
            
                count\t\tHardware Platform
                --------------------------------
                        3\tMalone
                        3\tMarlin
                        2\tMidland
                        2\tNemo
                        1\tTyler
                        1\tAmarillo_4K
                        1\tLittlefield
                        1\tLiberty
                        1\tGilbert
                        1\tLongview
                        1\tGilbert 4K
                        1\tBenjamin
            
            
                count\t\tApplication Version
                -----------------------------
                        18\t2.6.6
            
            
                Stack Trace
                -------------------------------------------------
            
            
            Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941) 
            Backtrace: 
            #1  Function doupdatecaptionsmode() As Void 
                file/line: pkg:/components/playerscreen/PlayerScreen.brs(2941) 
            #0  Function onfullscreenanimationfinished() As Void 
                file/line: pkg:/components/playerscreen/PlayerScreen.brs(741) 
            Local Variables: 
            global           Interface:ifGlobal 
            m                roAssociativeArray refcnt=3 count:67 
            ccsetting        roString refcnt=1 val:"On"
            `);

            expectContainSubset(file.crashes[0], {
                errorMessage: 'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                stackFrame: [
                    {
                        scope: 'Function doupdatecaptionsmode() As Void',
                        reference: {
                            length: 51,
                            offset: 1240,
                            pkgLocation: {
                                character: 0,
                                line: 2940,
                                path: 'pkg:/components/playerscreen/PlayerScreen.brs'
                            },
                            range: {
                                end: {
                                    character: 78,
                                    line: 32
                                },
                                start: {
                                    character: 27,
                                    line: 32
                                }
                            }
                        }
                    },
                    {
                        scope: 'Function onfullscreenanimationfinished() As Void',
                        reference: {
                            length: 50,
                            offset: 1386,
                            pkgLocation: {
                                character: 0,
                                line: 740,
                                path: 'pkg:/components/playerscreen/PlayerScreen.brs'
                            },
                            range: {
                                end: {
                                    character: 77,
                                    line: 34
                                },
                                start: {
                                    character: 27,
                                    line: 34
                                }
                            }
                        }
                    }
                ],
                localVariables: [
                    { name: 'global', metadata: 'Interface:ifGlobal' },
                    { name: 'm', metadata: 'roAssociativeArray refcnt=3 count:67' },
                    { name: 'ccsetting', metadata: 'roString refcnt=1 val:"On"' }
                ],
                applicationVersions: [{ count: 18, version: { major: 2, minor: 6, build: 6 }, rawVersion: '2.6.6' }],
                count: {
                    total: 18,
                    details: [
                        { count: 3, hardwarePlatform: 'Malone' },
                        { count: 3, hardwarePlatform: 'Marlin' },
                        { count: 2, hardwarePlatform: 'Midland' },
                        { count: 2, hardwarePlatform: 'Nemo' },
                        { count: 1, hardwarePlatform: 'Tyler' },
                        { count: 1, hardwarePlatform: 'Amarillo_4K' },
                        { count: 1, hardwarePlatform: 'Littlefield' },
                        { count: 1, hardwarePlatform: 'Liberty' },
                        { count: 1, hardwarePlatform: 'Gilbert' },
                        { count: 1, hardwarePlatform: 'Longview' },
                        { count: 1, hardwarePlatform: 'Gilbert 4K' },
                        { count: 1, hardwarePlatform: 'Benjamin' }
                    ]
                }
            });
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
