import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // 'super' must be called before accessing 'this' in the constructor of a derived class
        // and therefore before the precondition check
        super(delimiter);

        // Precondition
        for (let i = 0; i < source.length; i++) {
            IllegalArgumentException.assert(
                this.isValidComponent(source[i]),
                "Name components must be properly masked."
            );
        }

        this.components = source;

        // Class Invariants
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.components.length;

        // Postconditions
        this.assertIsValidNoComponentsAsPostcondition(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public getComponent(i: number): string {
        // Class Invariants
        this.assertClassInvariants();
        // Precondition
        this.assertIsValidIndexAsPrecondition(i);

        const result = this.components[i];

        // Postconditions
        this.assertIsValidComponentAsPostcondition(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public setComponent(i: number, c: string) {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);
        this.assertIsValidComponentAsPrecondition(c);
        // Create Backup for Postcondition
        const backup = this.createBackup();

        this.components[i] = c;

        // Postconditions
        MethodFailedException.assert(
            this.components.length === backup.components.length,
            "Set new Name component failed."
        );
        MethodFailedException.assert(
            this.components[i] === c,
            "Set new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        IllegalArgumentException.assert(
            (i >= 0 && i <= this.components.length),
            "Index out of bounds.");
        this.assertIsValidComponentAsPrecondition(c);
        // Create Backup for Postcondition
        const backup = this.createBackup();

        this.components.splice(i, 0, c);

        // Postconditions
        MethodFailedException.assert(
            this.components.length === backup.components.length + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            this.components[i] === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    public append(c: string) {
        // Class Invariants
        this.assertClassInvariants();
        // Precondition
        this.assertIsValidComponentAsPrecondition(c);
        // Create Backup for Postcondition
        const backup = this.createBackup();

        this.components.push(c);

        // Postconditions
        MethodFailedException.assert(
            this.components.length === backup.components.length + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            this.components[backup.components.length] === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    public remove(i: number) {
        // Class Invariants
        this.assertClassInvariants();
        // Precondition
        this.assertIsValidIndexAsPrecondition(i);
        // Create Backup for Postcondition
        const backup = this.createBackup();

        this.components.splice(i, 1);

        // Postconditions
        MethodFailedException.assert(
            this.components.length === backup.components.length - 1,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    private assertIsValidIndexAsPrecondition(i: number): void {
        let condition: boolean = (i >= 0 && i < this.components.length);
        IllegalArgumentException.assert(condition, "Index out of bounds.");
    }

    protected assertClassInvariants(): void {
        this.assertIsValidDelimiterAsClassInvariant();
        this.assertIsValidComponentsAsClassInvariant();
    }

    private assertIsValidComponentsAsClassInvariant(): void {
        InvalidStateException.assert(
            (this.components !== null) && (this.components !== undefined),
            "Name components must not be null or undefined."
        );
        for (let i = 0; i < this.components.length; i++) {
            InvalidStateException.assert(
                (this.components[i] !== null) && (this.components[i] !== undefined),
                "Name component must not be null or undefined."
            );
            InvalidStateException.assert(
                this.isValidComponent(this.components[i]),
                "Name components must be properly masked."
            );
        }
    }

    private createBackup(): { components: string[]; delimiter: string } {
        return {
            components: [...this.components],
            delimiter: this.delimiter
        };
    }

}