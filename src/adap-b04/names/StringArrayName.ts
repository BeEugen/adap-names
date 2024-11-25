import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        // 'super' must be called before accessing 'this' in the constructor of a derived class
        // and therefore before the precondition check
        super(delimiter);

        // Precondition
        for (let i = 0; i < other.length; i++) {
            IllegalArgumentException.assertCondition(
                this.isValidComponent(other[i]),
                "Name components must be properly masked."
            );
        }

        this.components = other;

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
        MethodFailureException.assertCondition(
            this.components.length === backup.components.length,
            "Set new Name component failed."
        );
        MethodFailureException.assertCondition(
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
        IllegalArgumentException.assertCondition(
            (i >= 0 && i <= this.components.length),
            "Index out of bounds.");
        this.assertIsValidComponentAsPrecondition(c);
        // Create Backup for Postcondition
        const backup = this.createBackup();

        this.components.splice(i, 0, c);

        // Postconditions
        MethodFailureException.assertCondition(
            this.components.length === backup.components.length + 1,
            "Insert new Name component failed."
        );
        MethodFailureException.assertCondition(
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
        MethodFailureException.assertCondition(
            this.components.length === backup.components.length + 1,
            "Insert new Name component failed."
        );
        MethodFailureException.assertCondition(
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
        MethodFailureException.assertCondition(
            this.components.length === backup.components.length - 1,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    private assertIsValidIndexAsPrecondition(i: number): void {
        let condition: boolean = (i >= 0 && i < this.components.length);
        IllegalArgumentException.assertCondition(condition, "Index out of bounds.");
    }

    protected assertClassInvariants(): void {
        this.assertIsValidDelimiterAsClassInvariant();
        this.assertIsValidComponentsAsClassInvariant();
    }

    private assertIsValidComponentsAsClassInvariant(): void {
        InvalidStateException.assertIsNotNullOrUndefined(
            this.components,
            "Name components must not be null or undefined."
        );
        for (let i = 0; i < this.components.length; i++) {
            InvalidStateException.assertIsNotNullOrUndefined(
                this.components[i],
                "Name components must not be null or undefined."
            );
            InvalidStateException.assertCondition(
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