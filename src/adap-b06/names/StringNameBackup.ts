import { AbstractNameBackup } from "./AbstractNameBackup";

export class StringNameBackup extends AbstractNameBackup {

    protected name: string;
    protected noComponents: number;

    constructor(name: string, noComponents: number, delimiter: string) {
        super(delimiter);
        this.name = name;
        this.noComponents = noComponents;
    }

    public getName(): string {
        return this.name;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

}