import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        this.components = other;
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds.");
        }
        this.components.splice(i, 0, c);
    }

    append(c: string) {
        this.components.push(c);
    }

    remove(i: number) {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

}