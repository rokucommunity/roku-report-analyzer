import * as fsExtra from 'fs-extra';
import * as path from 'path';
import type { Runner } from './Runner';
import { standardizePath as s } from 'brighterscript';

export class Project {
    public constructor(
        public runner: Runner,
        public srcPath: string
    ) {
        this.processSrcPath();
    }

    public prefix: string | undefined = undefined;

    public async load() {
        await this.loadComlibNameFromManifest();
        if (!this.prefix) {
            this.prefix = 'pkg';
        }
    }

    private async loadComlibNameFromManifest() {
        const manifestPath = path.join(this.srcPath, 'manifest');
        if (!this.prefix && await fsExtra.pathExists(manifestPath)) {
            //load the manifest and check for
            const manifest = (await fsExtra.readFile(manifestPath)).toString();
            //get the complib name
            const match = /^\s*sg_component_libs_provided\s*=\s*(.*)/.exec(manifest);
            if (match) {
                this.prefix = match[1];
            }
        }
    }

    /**
     * Project prefixes can be explicitly given a complib name (sg_component_libs_provided) at the front of the path.
     * The limitation is that we don't support complibs with a single a-z character name (to eliminate windows path collisions with drive names)
     */
    private processSrcPath() {
        const match = /(.{2,999}?):(.*)/.exec(this.srcPath);
        if (match) {
            this.prefix = match[1];
            this.srcPath = match[2];
        }
        this.srcPath = s`${path.resolve(this.runner.cwd, this.srcPath)}`;
    }
}
