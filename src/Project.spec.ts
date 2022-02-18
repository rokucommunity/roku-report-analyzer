
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
});
