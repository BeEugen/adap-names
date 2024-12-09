import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { StringArrayNameBackup } from "./StringArrayNameBackup";

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

        this.components = [...source];

        // Class Invariants
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();

        const result = this.components.length;

        // Postconditions
        this.assertIsValidNoComponentsAsPostcondition(result);
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public getComponent(i: number): string {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);

        const result = this.components[i];

        // Postconditions
        this.assertIsValidComponentAsPostcondition(result);
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public setComponent(i: number, c: string): StringArrayName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);
        this.assertIsValidComponentAsPrecondition(c);

        let componentsClone: string[] = [...this.components];
        componentsClone[i] = c;
        const result: StringArrayName = new StringArrayName(componentsClone, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getComponents().length,
            "Set new Name component failed."
        );
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "Set new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public insert(i: number, c: string): StringArrayName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();
        // Preconditions
        IllegalArgumentException.assert(
            (i >= 0 && i <= this.components.length),
            "Index out of bounds.");
        this.assertIsValidComponentAsPrecondition(c);

        let componentsClone: string[] = [...this.components];
        componentsClone.splice(i, 0, c);
        const result: StringArrayName = new StringArrayName(componentsClone, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getComponents().length + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public append(c: string): StringArrayName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();
        // Precondition
        this.assertIsValidComponentAsPrecondition(c);

        let componentsClone: string[] = [...this.components];
        componentsClone.push(c);
        const result: StringArrayName = new StringArrayName(componentsClone, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getComponents().length + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            result.getComponent(backup.getComponents().length) === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public remove(i: number): StringArrayName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringArrayNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);

        let componentsClone: string[] = [...this.components];
        componentsClone.splice(i, 1);
        const result: StringArrayName = new StringArrayName(componentsClone, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getComponents().length - 1,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
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

    protected assertImmutableAsClassInvariant(backup: StringArrayNameBackup): void {
        InvalidStateException.assert(
            this.isEqualComponents(backup.getComponents()) && (this.delimiter === backup.getDelimiter()),
            "Immutable StringArrayName must not be modified."
        );
    }

    protected createBackup(): StringArrayNameBackup {
        return new StringArrayNameBackup(this.components, this.delimiter);
    }

    private isEqualComponents(other: string[]): boolean {
        if (this.components.length !== other.length) {
            return false;
        }
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] !== other[i]) {
                return false;
            }
        }
        return true;
    }

}