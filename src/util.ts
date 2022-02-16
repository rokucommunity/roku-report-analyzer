import * as fsExtra from 'fs-extra';
class Util {
    public isDirSync(dirPath: string) {
        return fsExtra.existsSync(dirPath) && fsExtra.lstatSync(dirPath).isDirectory()
    }
}

export const util = new Util();