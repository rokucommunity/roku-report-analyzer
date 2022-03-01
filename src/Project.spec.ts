import * as fsExtra from 'fs-extra';
import * as path from 'path';

import { Project } from './Project';
import { Runner } from './Runner';
import type { RunnerOptions } from './interfaces';
import { expect } from 'chai';
import { standardizePath as s } from 'brighterscript';

const tempDir = path.join(process.cwd(), '.tmp');
const projectDir = path.join(tempDir, 'project');

describe('Project', () => {
    let runner: Runner;
    let runnerOptions: RunnerOptions;
    let project: Project;
    beforeEach(() => {
        fsExtra.emptydirSync(tempDir);
        runnerOptions = {
            cwd: tempDir,
            crashlogs: [],
            projects: [projectDir]
        };
        runner = new Runner(runnerOptions);
    });
    afterEach(() => {
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
});
