import * as zlib from 'zlib';

class Util {
    public unzip(srcPath: string, destPath: string) {
        zlib.gunzipSync();
    }
}

export const util = new Util();