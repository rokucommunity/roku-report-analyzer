import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { util as bscUtil, standardizePath as s } from 'brighterscript';
import { CrashlogFile } from './CrashlogFile';
import { Runner } from './Runner';
import type { RunnerOptions } from './interfaces';
// TODO: How to remove this? No quickfix.
// eslint-disable-next-line sort-imports
import { ProductionStatus } from './interfaces';
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
        describe('parses the hardware platform section', () => {
            it('empty section', () => {
                expect(file.parseHardwarePlatformSection([])).to.be.empty;
                expect(file.parseHardwarePlatformSection(['', ''])).to.be.empty;
                expect(file.parseHardwarePlatformSection(['', '', ''])).to.be.empty;
            });

            it('contains underscores', () => {
                expectContainSubset(
                    // eslint-disable-next-line no-tabs
                    file.parseHardwarePlatformSection(['1	Amarillo_4K']),
                    [
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Streaming Stick', codeName: 'Amarillo 1080', model: '3800X', productionStatus: ProductionStatus.Updatable }
                        }
                    ]
                );
            });

            it('contains unknowns', () => {
                expectContainSubset(
                    // eslint-disable-next-line no-tabs
                    file.parseHardwarePlatformSection(['1	SomeNonExisting CodeName']),
                    [
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Unknown', codeName: 'SomeNonExisting CodeName', model: 'Unknown', productionStatus: ProductionStatus.Unknown }
                        }
                    ]
                );
            });
        });

        describe('parses the application version section', () => {
            it('empty section', () => {
                expect(file.parseApplicationVersionSection([])).to.eql([]);
                expect(file.parseApplicationVersionSection([''])).to.eql([]);
                expect(file.parseApplicationVersionSection(['', ''])).to.eql([]);
            });

            it('normal versions', () => {
                expect(file.parseApplicationVersionSection([
                    /* eslint-disable no-tabs */
                    '1	3.6.5',
                    '2	0,0,1',
                    '5	4;2;0',
                    '3	2.6.590'
                    /* eslint-enable */
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
                /* eslint-disable no-tabs */
                    '1	3 6 5',
                    '2	0	0	1',
                    '5	ver4.2.0',
                    '3	2.6.590-hotfix',
                    '1	a.4.6'
                /* eslint-enable */
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
                            // eslint-disable-next-line no-tabs
                            rawVersion: '0	0	1'
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

        });

        it('structures crashes correctly', () => {
            /* eslint-disable no-tabs */
            file.parse(`
                18 	Function doupdatecaptionsmode() As Void; pkg:/components/playerscreen/PlayerScreen.brs(2941)
                ____________________________________________________
            
                count		Hardware Platform
                --------------------------------
                        3	Malone
                        3	Marlin
                        2	Midland
                        2	Nemo
                        1	Tyler
                        1	Amarillo_4K
                        1	Littlefield
                        1	Liberty
                        1	Gilbert
                        1	Longview
                        1	Gilbert 4K
                        1	Benjamin
            
            
                count		Application Version
                -----------------------------
                        18	2.6.6
            
            
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
            /* eslint-enable */

            expectContainSubset(file.crashes[0], {
                errorMessage: 'Interface not a member of BrightScript Component (runtime error &hf3) in pkg:/components/playerscreen/PlayerScreen.brs(2941)',
                stackTrace: [
                    {
                        scope: 'Function doupdatecaptionsmode() As Void',
                        pkgLocation: {
                            path: 'pkg:/components/playerscreen/PlayerScreen.brs',
                            line: 2940,
                            character: 0
                        }
                    },
                    {
                        scope: 'Function onfullscreenanimationfinished() As Void',
                        pkgLocation: {
                            path: 'pkg:/components/playerscreen/PlayerScreen.brs',
                            line: 740,
                            character: 0
                        }
                    }
                ],
                localVariables: [
                    { name: 'global', metadata: 'Interface:ifGlobal' },
                    { name: 'm', metadata: 'roAssociativeArray refcnt=3 count:67' },
                    { name: 'ccsetting', metadata: 'roString refcnt=1 val:"On"' }
                ],
                applicationVersions: [{ count: 18, version: { major: 2, minor: 6, build: 6 } }],
                count: {
                    total: 18,
                    details: [
                        {
                            count: 3,
                            hardwarePlatform: { productName: '4K Roku TV', codeName: 'Malone', model: 'C000X', productionStatus: ProductionStatus.Current }
                        },
                        {
                            count: 3,
                            hardwarePlatform: { productName: 'Roku Express 4K', codeName: 'Marlin 4K', model: '3940X', productionStatus: ProductionStatus.Current }
                        },
                        {
                            count: 2,
                            hardwarePlatform: { productName: 'Roku TV', codeName: 'Midland', model: '8000X', productionStatus: ProductionStatus.Current }
                        },
                        {
                            count: 2,
                            hardwarePlatform: { productName: 'Roku Express', codeName: 'Nemo', model: '3930X', productionStatus: ProductionStatus.Current }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku LT', codeName: 'Tyler', model: '2700X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Streaming Stick', codeName: 'Amarillo 1080', model: '3800X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Express', codeName: 'Littlefield', model: '3700X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku TV', codeName: 'Liberty', model: '5000X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Express', codeName: 'Gilbert', model: '3900X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: '4K Roku TV', codeName: 'Longview', model: '7000X', productionStatus: ProductionStatus.Current }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Premiere', codeName: 'Gilbert 4K', model: '3920X', productionStatus: ProductionStatus.Updatable }
                        },
                        {
                            count: 1,
                            hardwarePlatform: { productName: 'Roku Ultra', codeName: 'Benjamin', model: '4800X', productionStatus: ProductionStatus.Current }
                        }
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
