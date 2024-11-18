import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        if (other !== "") {
            this.length = this.asComponentArray().length;
        }
    }

    getNoComponents(): number {
        return this.length;
    }

    getComponent(i: number): string {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        return components[i];
    }

    setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.length) {
            throw new Error("Index out of bounds.");
        }
        const components = this.asComponentArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.length++;
    }

    append(c: string) {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.length++;
    }

    remove(i: number) {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.length--;
    }

    private asComponentArray(): string[] {
        // Escape special characters for use in a regular expression
        const escapedDelimiter = this.escapeRegexInput(this.delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);

        // Create a regular expression that matches the delimiter, but avoids those preceded by the escape character
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
        return this.name.split(regex);
    }

    // Escape all special characters in the input string for use in a regular expression
    private escapeRegexInput(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}