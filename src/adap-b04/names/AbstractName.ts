import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition
        this.assertIsValidDelimiterAsPrecondition(delimiter);

        this.delimiter = delimiter;
    }

    // Returns shallow copy (clone) of this object
    public clone(): Name {
        // Class Invariants
        this.assertClassInvariants();

        const result = Object.create(this);

        // Postcondition
        MethodFailureException.assertIsNotNullOrUndefined(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        // Class Invariants
        this.assertClassInvariants();
        // Precondition
        this.assertIsValidDelimiterAsPrecondition(delimiter);

        let resultString = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmaskedComponent = this.unmaskComponent(this.getComponent(i), this.delimiter);
            if (i === 0) {
                resultString += unmaskedComponent;
            } else {
                resultString += delimiter + unmaskedComponent;
            }
        }

        // Postcondition
        MethodFailureException.assertIsNotNullOrUndefined(resultString);
        // Class Invariants
        this.assertClassInvariants();
        return resultString;
    }

    public toString(): string {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.asDataString();

        // Postcondition
        MethodFailureException.assertIsNotNullOrUndefined(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public asDataString(): string {
        // Class Invariants
        this.assertClassInvariants();

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

        // Postcondition
        MethodFailureException.assertIsNotNullOrUndefined(resultString);
        // Class Invariants
        this.assertClassInvariants();
        return resultString;
    }

    public isEqual(other: Name): boolean {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.delimiter === other.getDelimiterCharacter() &&
            this.asDataString() === other.asDataString();

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public getHashCode(): number {
        // Class Invariants
        this.assertClassInvariants();

        let hashCode: number = 0;
        const s: string = this.delimiter + this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }

        // Class Invariants
        this.assertClassInvariants();
        return hashCode;
    }

    public isEmpty(): boolean {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.getNoComponents() === 0;

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public getDelimiterCharacter(): string {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.delimiter;

        // Postcondition
        this.assertIsValidDelimiterAsPostcondition(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Class Invariants
        this.assertClassInvariants();

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

        // Class Invariants
        this.assertClassInvariants();
    }

    protected unmaskComponent(c: string, delimiter: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + delimiter, delimiter);
    }

    protected maskComponent(c: string, delimiter: string): string {
        return c.replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

    protected abstract assertClassInvariants(): void;

    protected assertIsValidDelimiterAsPrecondition(delimiter: string): void {
        let condition: boolean = (delimiter.length === 1);
        IllegalArgumentException.assertCondition(condition, "Delimiter must be a single character.");
    }

    protected assertIsValidDelimiterAsPostcondition(delimiter: string): void {
        MethodFailureException.assertIsNotNullOrUndefined(delimiter, "Delimiter must not be null or undefined.");
        MethodFailureException.assertCondition((this.delimiter.length === 1), "Delimiter must be a single character.");
    }

    protected assertIsValidComponentAsPrecondition(c: string): void {
        let condition: boolean = this.isValidComponent(c);
        IllegalArgumentException.assertCondition(condition, "New Name component must be properly masked.");
    }

    protected assertIsValidComponentAsPostcondition(c: string): void {
        MethodFailureException.assertIsNotNullOrUndefined(c, "Name component must not be null or undefined.");
        MethodFailureException.assertCondition(this.isValidComponent(c), "Name component must be properly masked.");
    }

    protected assertIsValidDelimiterAsClassInvariant(): void {
        InvalidStateException.assertIsNotNullOrUndefined(this.delimiter, "Delimiter must not be null or undefined.");
        InvalidStateException.assertCondition((this.delimiter.length === 1), "Delimiter must be a single character.");
    }

    protected assertIsValidNoComponentsAsPostcondition(noComponents: number) {
        MethodFailureException.assertCondition(noComponents >= 0, "Number of Name components must not be a negative value.");
    }

    protected isValidComponent(c: string): boolean {
        // Escape special characters for use in a regular expression
        const escapedDelimiter = this.escapeRegexInput(this.delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);

        // Create a regular expression that matches the first unescaped delimiter character
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`);
        return !regex.test(c);
    }

    // Escape all special characters in the input string for use in a regular expression
    protected escapeRegexInput(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}