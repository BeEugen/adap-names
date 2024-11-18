import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let resultString = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmaskedComponent = this.unmaskComponent(this.getComponent(i), this.delimiter);
            if (i === 0) {
                resultString += unmaskedComponent;
            } else {
                resultString += delimiter + unmaskedComponent;
            }
        }
        return resultString;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let resultString = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const maskedComponent = this.getComponent(i);
            if (i === 0) {
                resultString += maskedComponent;
            } else {
                resultString += this.delimiter + maskedComponent;
            }
        }
        return resultString;
    }

    public isEqual(other: Name): boolean {
        return this.delimiter === other.getDelimiterCharacter() &&
            this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.delimiter + this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // Returns shallow copy (clone) of this object
    public clone(): Name {
        return Object.create(this);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const count = other.getNoComponents();
        const otherDelimiter = other.getDelimiterCharacter();

        if (this.delimiter === otherDelimiter) {
            // Masking is already correct
            for (let i = 0; i < count; i++) {
                this.append(other.getComponent(i));
            }
        } else {
            // Masking needs to be adjusted
            for (let i = 0; i < count; i++) {
                const otherComponent = other.getComponent(i);
                // Remove escape character from other delimiter and add escape character to this delimiter
                const preparedComponent = this.maskComponent(
                    this.unmaskComponent(otherComponent, otherDelimiter),
                    this.delimiter);
                this.append(preparedComponent);
            }
        }
    }

    protected unmaskComponent(c: string, delimiter: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + delimiter, delimiter);
    }

    protected maskComponent(c: string, delimiter: string): string {
        return c.replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

    protected assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error("Index out of bounds.");
        }
    }

}