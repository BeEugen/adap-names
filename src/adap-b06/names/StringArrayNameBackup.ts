import { AbstractNameBackup } from "./AbstractNameBackup";

export class StringArrayNameBackup extends AbstractNameBackup {

    protected components: string[];

    constructor(components: string[], delimiter: string) {
        super(delimiter);
        this.components = [...components];
    }

    public getComponents(): string[] {
        return this.components;
    }

}