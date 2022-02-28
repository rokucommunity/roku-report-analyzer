import * as AdmZip from 'adm-zip';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as fsExtra from 'fs-extra';
import { expect } from 'chai';

chai.use(chaiSubset);

/**
 * Create a zip from in-memory file strings
 */
export function createZip(files: Record<string, string>, dest: string) {
    const zip = new AdmZip();
    for (const filePath of Object.keys(files)) {
        zip.addFile(filePath, Buffer.from(files[filePath], 'utf8'));
    }
    return new Promise<void>((resolve, reject) => {
        zip.writeZip(dest, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function expectEql<T>(actual: T, expected: T) {
    chai.expect(actual).to.eql(expected);
}

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export function expectContainSubset<T>(actual: T, expected: RecursivePartial<T>) {
    chai.expect(actual).containSubset(expected);
}

export function expectFileEquals(filePath: string, expectedContents: string) {
    if (!fsExtra.pathExistsSync(filePath)) {
        throw new Error(`File does not exist: "${filePath}"`);
    }
    expect(fsExtra.readFileSync(filePath).toString()).to.eql(expectedContents);
}
