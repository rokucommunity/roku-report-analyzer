import * as AdmZip from 'adm-zip';

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
