import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

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

        const result = this.noComponents;

        // Postconditions
        this.assertIsValidNoComponentsAsPostcondition(result);
        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public getComponent(i: number): string {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsValidIndexAsPrecondition(i);

        const components = this.asComponentArray();
        const result = components[i];

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
        // Backup for postconditions
        const backup = this.createBackup();

        const components = this.asComponentArray();
        components[i] = c;
        this.name = components.join(this.delimiter);

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === backup.noComponents,
            "Set new Name component failed."
        );
        MethodFailedException.assert(
            this.getComponent(i) === c,
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
            (i >= 0 && i <= this.noComponents),
            "Index out of bounds.");
        this.assertIsValidComponentAsPrecondition(c);
        // Backup for postconditions
        const backup = this.createBackup();

        const components = this.asComponentArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === backup.noComponents + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            this.getComponent(i) === c,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
    }

    public append(c: string) {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsValidComponentAsPrecondition(c);
        // Backup for postconditions
        const backup = this.createBackup();

        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === backup.noComponents + 1,
            "Insert new Name component failed."
        );
        MethodFailedException.assert(
            this.getComponent(backup.noComponents) === c,
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
        // Backup for postconditions
        const backup = this.createBackup();

        const components = this.asComponentArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === backup.noComponents - 1,
            "Insert new Name component failed."
        );
        // Class Invariants
        this.assertClassInvariants();
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

    private createBackup(): { name: string; delimiter: string, noComponents: number } {
        return {
            name: this.name,
            delimiter: this.delimiter,
            noComponents: this.noComponents
        };
    }

}