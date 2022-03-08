import * as fsExtra from 'fs-extra';
import * as path from 'path';

import { Cache } from './Cache';
import type { Location } from './interfaces';
import type { Runner } from './Runner';
import { SourceMapConsumer } from 'source-map';
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
        await this.loadComplibNameFromManifest();
        this.prefix = this.prefix ?? 'pkg';
        this.prefixRegexp = new RegExp('^' + this.prefix + ':', 'i');
    }

    private prefixRegexp = /^pkg:/i;

    /**
     * Get a sourcemap for the specified file, or undefined if not found
     */
    private getSourcemapConsumer(destPath: string) {
        return this.cache.getOrAdd(destPath, async () => {
            try {
                if (await fsExtra.pathExists(destPath)) {
                    const map = (await fsExtra.readFile(destPath)).toString();
                    return await new SourceMapConsumer(JSON.parse(map));
                }
            } finally { }
        });
    }
    private cache = new Cache<string, Promise<SourceMapConsumer | undefined>>();

    public async getOriginalLocation(location: Location): Promise<Location | undefined> {
        const destPath = s`${location.path.replace(this.prefixRegexp, this.srcPath)}`;
        const destMapPath = destPath + '.map';
        const consumer = await this.getSourcemapConsumer(destMapPath);
        if (consumer) {
            const position = consumer.originalPositionFor({
                //source-map needs 1-based line number
                line: location.line + 1,
                //zero-based column number
                column: location.character ?? 0,
                //snap to the right item when possible
                bias: SourceMapConsumer.LEAST_UPPER_BOUND
            });
            const destMapDir = path.dirname(destMapPath);

            if (position && typeof position.line === 'number' && typeof position.column === 'number' && typeof position.source === 'string') {
                return {
                    //we receive 1-based line num, but need to store 0-based
                    line: position.line - 1,
                    character: position.column,
                    path: s`${path.resolve(destMapDir, position.source)}`
                };
            }

            //if there is no source map, and the file exists in dest, then assume the line numbers are one-to-one between dest and src
        } else if (await fsExtra.pathExists(destPath)) {
            return {
                line: location.line,
                character: location.character,
                path: destPath
            };
        }
    }

    private async loadComplibNameFromManifest() {
        const manifestPath = s`${path.join(this.srcPath, 'manifest')}`;
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
