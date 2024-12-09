import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { StringNameBackup } from "./StringNameBackup";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        if (source !== "") {
            this.noComponents = this.asComponentArray().length;
        }

        // Class Invariants
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();

        const result = this.noComponents;

        // Postconditions
        this.assertIsValidNoComponentsAsPostcondition(result);
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public getComponent(i: number): string {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);

        const components = this.asComponentArray();
        const result = components[i];

        // Postconditions
        this.assertIsValidComponentAsPostcondition(result);
        // Class Invariants
        this.assertClassInvariants();
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public setComponent(i: number, c: string): StringName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);
        this.assertIsValidComponentAsPrecondition(c);

        const components = this.asComponentArray();
        components[i] = c;
        const newName = components.join(this.delimiter);
        const result: StringName = new StringName(newName, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getNoComponents(),
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

    public insert(i: number, c: string): StringName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();
        // Preconditions
        IllegalArgumentException.assert(
            (i >= 0 && i <= this.noComponents),
            "Index out of bounds.");
        this.assertIsValidComponentAsPrecondition(c);

        const components = this.asComponentArray();
        components.splice(i, 0, c);
        const newName = components.join(this.delimiter);
        const result: StringName = new StringName(newName, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getNoComponents() + 1,
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

    public append(c: string): StringName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();
        // Preconditions
        this.assertIsValidComponentAsPrecondition(c);

        let newName: string = this.name;
        if (this.isEmpty()) {
            newName = c;
        } else {
            newName += this.delimiter + c;
        }
        const result: StringName = new StringName(newName, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getNoComponents() + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            result.getComponent(backup.getNoComponents()) === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    public remove(i: number): StringName {
        // Class Invariants
        this.assertClassInvariants();
        const backup: StringNameBackup = this.createBackup();
        // Precondition
        this.assertIsValidIndexAsPrecondition(i);

        const components = this.asComponentArray();
        components.splice(i, 1);
        const newName = components.join(this.delimiter);
        const result: StringName = new StringName(newName, this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            result.getNoComponents() === backup.getNoComponents() - 1,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertImmutableAsClassInvariant(backup);
        return result;
    }

    private asComponentArray(): string[] {
        // Escape special characters for use in a regular expression
        const escapedDelimiter = this.escapeRegexInput(this.delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);

        // Create a regular expression that matches all unescaped delimiter characters
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
        return this.name.split(regex);
    }

    private assertIsValidIndexAsPrecondition(i: number): void {
        let condition: boolean = (i >= 0 && i < this.noComponents);
        IllegalArgumentException.assert(condition, "Index out of bounds.");
    }

    protected assertClassInvariants(): void {
        this.assertIsValidDelimiterAsClassInvariant();
        this.assertIsValidNameAsClassInvariant();
        this.assertIsValidNoComponentsAsClassInvariant();
    }

    private assertIsValidNameAsClassInvariant(): void {
        InvalidStateException.assert(
            (this.name !== null) && (this.name !== undefined),
            "Name must not be null or undefined."
        );
    }

    private assertIsValidNoComponentsAsClassInvariant(): void {
        InvalidStateException.assert(
            this.noComponents >= 0,
            "Number of Name components must not be a negative value."
        );
    }

    protected assertImmutableAsClassInvariant(backup: StringNameBackup): void {
        InvalidStateException.assert(
            (this.name === backup.getName()) &&
            (this.noComponents === backup.getNoComponents()) &&
            (this.delimiter === backup.getDelimiter()),
            "Immutable StringName must not be modified."
        );
    }

    protected createBackup(): StringNameBackup {
        return new StringNameBackup(this.name, this.noComponents, this.delimiter);
    }

}