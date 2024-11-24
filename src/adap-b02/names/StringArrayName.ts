import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.unmaskComponent(c, this.delimiter))
            .join(delimiter);
    }

    public asDataString(): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.components.join(DEFAULT_DELIMITER);
        } else {
            // Needs masking adjustment to match the default delimiter
            return this.components
                .map(c => this.maskComponent(
                    this.unmaskComponent(c, this.delimiter),
                    DEFAULT_DELIMITER))
                .join(DEFAULT_DELIMITER);
        }
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds.");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const otherDelimiter = other.getDelimiterCharacter();
        const needsMaskingAdjustment = this.delimiter !== otherDelimiter;

        for (let i = 0; i < other.getNoComponents(); i++) {
            let component = other.getComponent(i);
            if (needsMaskingAdjustment) {
                // Adjust masking to match the delimiter of this Name instance
                component = this.maskComponent(
                    this.unmaskComponent(component, otherDelimiter),
                    this.delimiter
                );
            }
            this.append(component);
        }
    }

    private unmaskComponent(c: string, delimiter: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + delimiter, delimiter);
    }

    private maskComponent(c: string, delimiter: string): string {
        return c.replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds.");
        }
    }

}