import { ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        if (source !== "") {
            this.noComponents = this.asComponentArray().length;
        }
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds.");
        }
        const components = this.asComponentArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string) {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
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