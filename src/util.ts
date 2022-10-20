import * as fsExtra from 'fs-extra';
import type { Location } from './interfaces';
import type { Range } from 'brighterscript';

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

    public areRangesEqual(rangeA: Range, rangeB: Range) {
        return (
            rangeA.start.line === rangeB.start.line &&
            rangeA.start.character === rangeB.start.character &&
            rangeA.end.line === rangeB.end.line &&
            rangeA.end.character === rangeB.end.character
        );
    }
}

export const util = new Util();
