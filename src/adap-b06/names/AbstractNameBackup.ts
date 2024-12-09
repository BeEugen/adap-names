export abstract class AbstractNameBackup {

    protected delimiter: string;

    constructor(delimiter: string) {
        this.delimiter = delimiter;
    }

    public getDelimiter(): string {
        return this.delimiter;
    }

}