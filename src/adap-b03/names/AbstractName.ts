import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

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

    // Returns shallow copy (clone) of this object
    public clone(): Name {
        return Object.create(this);
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
        const needsMaskingAdjustment = this.delimiter !== DEFAULT_DELIMITER;
        let resultString = "";

        for (let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            if (needsMaskingAdjustment) {
                // Adjust masking to match the default delimiter
                component = this.maskComponent(
                    this.unmaskComponent(component, this.delimiter),
                    DEFAULT_DELIMITER
                );
            }
            if (i === 0) {
                resultString = component;
            } else {
                resultString += DEFAULT_DELIMITER + component;
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