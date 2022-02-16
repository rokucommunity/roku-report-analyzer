export class CrashlogFile {
    public constructor(
        /**
         * The path to the original source file
         */
        public srcPath: string
    ) { }

    /**
     * The full text contents of this file
     */
    public fileContents = '';

    public parse(fileContents: string) {
        this.fileContents = fileContents;
    }

}
