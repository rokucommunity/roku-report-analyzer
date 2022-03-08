import * as fsExtra from 'fs-extra';
import * as path from 'path';
import type { NullableMappedPosition } from 'source-map';
import { Project } from './Project';
import { Runner } from './Runner';
import type { RunnerOptions } from './interfaces';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { standardizePath as s } from 'brighterscript';
const sinon = createSandbox();

const tempDir = path.join(process.cwd(), '.tmp');
const projectDir = path.join(tempDir, 'project');

describe('Project', () => {
    let runner: Runner;
    let runnerOptions: RunnerOptions;
    let project: Project;
    beforeEach(() => {
        sinon.restore();
        fsExtra.emptydirSync(tempDir);
        runnerOptions = {
            cwd: tempDir,
            crashlogs: ['crashlog'],
            projects: [projectDir]
        };
        runner = new Runner(runnerOptions);
    });
    afterEach(() => {
        sinon.restore();
        fsExtra.emptydirSync(tempDir);
    });

    it('stores srcPath', () => {
        project = new Project(runner, 'videoApp');
        expect(project.srcPath).to.eql(s`${tempDir}/videoApp`);
    });

    it('separates complib prefix and path', () => {
        project = new Project(runner, `complib1:${tempDir}\\videoApp`);
        expect(project.srcPath).to.eql(s`${tempDir}\\videoApp`);
        expect(project.prefix).to.eql('complib1');
    });

    it('loads complib name from manifest when found', async () => {
        fsExtra.outputFileSync(`${tempDir}/videoApp/manifest`, `
            sg_component_libs_provided=mycomplib
        `);
        project = new Project(runner, `${tempDir}\\videoApp`);
        await project.load();
        expect(project.prefix).to.equal('mycomplib');
    });

    it('overrides complib name when specified via command line', async () => {
        fsExtra.outputFileSync(`${tempDir}/videoApp/manifest`, `
            sg_component_libs_provided=mycomplib
        `);
        project = new Project(runner, `overrideprefix:${tempDir}\\videoApp`);
        await project.load();
        expect(project.prefix).to.equal('overrideprefix');
    });

    it('defaults to pkg when no manifest found and no prefix provided', async () => {
        project = new Project(runner, `${tempDir}\\videoApp`);
        await project.load();
        expect(project.prefix).to.eql('pkg');
    });

    it('defaults to pkg when manifest found but no sg_component_libs_provided key was found', async () => {
        fsExtra.outputFileSync(`${tempDir}/videoApp/manifest`, `
            nothing_useful=true
        `);
        project = new Project(runner, `${tempDir}\\videoApp`);
        await project.load();
        expect(project.prefix).to.equal('pkg');
    });

    describe('getOriginalLocation', () => {
        it('returns undefined for invalid sourcemap positions', async () => {
            const positions = [{
                line: undefined
            }, {
                line: null
            }, {
                line: 2,
                column: undefined
            }, {
                line: 2,
                column: 5,
                source: undefined
            }] as Array<Partial<NullableMappedPosition>>;
            project = new Project(runner, projectDir);
            sinon.stub(project as any, 'getSourcemapConsumer').callsFake(() => {
                return Promise.resolve({
                    originalPositionFor: () => {
                        return positions.pop();
                    }
                });
            });
            //none of these should throw (each call pops the next location from consumer)
            expect(await project.getOriginalLocation({ path: '', line: 1, character: 1 })).not.to.exist;
            expect(await project.getOriginalLocation({ path: '', line: 1, character: 1 })).not.to.exist;
            expect(await project.getOriginalLocation({ path: '', line: 1, character: 1 })).not.to.exist;
            //defaults location.character
            expect(await project.getOriginalLocation({ path: '', line: 1, character: undefined as any })).not.to.exist;
        });
    });
});
