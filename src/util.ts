import * as fsExtra from 'fs-extra';
import type { Location } from './interfaces';

class Util {
    public isDirSync(dirPath: string) {
        return fsExtra.existsSync(dirPath) && fsExtra.lstatSync(dirPath).isDirectory();
    }

    public createLocation(path: string, line: number, character: number) {
        return {
            path: path,
            line: line,
            character: character
        } as Location;
    }
}

export const util = new Util();
