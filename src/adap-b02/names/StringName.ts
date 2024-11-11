import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        this.name = other;
        if (delimiter) {
            this.assertIsValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
        if (other !== "") {
            this.length = this.asComponentArray().length;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        // Unmask name
        let unescapedName = this.name.split(ESCAPE_CHARACTER).join("");
        if (delimiter !== this.delimiter) {
            // Replace default delimiter
            unescapedName = unescapedName.split(this.delimiter).join(delimiter);
        }
        return unescapedName;
    }

    public asDataString(): string {
        return this.name;
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(x: number): string {
        this.assertIsValidIndex(x);
        const components = this.asComponentArray();
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        this.assertIsValidIndex(n);
        const components = this.asComponentArray();
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.length) {
            throw new Error("Index out of bounds.");
        }
        const components = this.asComponentArray();
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.length++;
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
        this.length++;
    }

    public remove(n: number): void {
        this.assertIsValidIndex(n);
        const components = this.asComponentArray();
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.length--;
    }

    public concat(other: Name): void {
        if (other.isEmpty()) {
            return;
        }

        let otherName = other.asDataString();
        const otherDelimiter = other.getDelimiterCharacter();
        const otherNoComponents = other.getNoComponents();

        if (otherDelimiter !== this.delimiter) {
            // Replace other delimiter by this delimiter
            otherName = otherName.split(otherDelimiter).join(this.delimiter);
        }
        if (this.isEmpty()) {
            this.name = otherName;
            this.length = otherNoComponents;
        } else {
            this.name = this.name + this.delimiter + otherName;
            this.length += otherNoComponents;
        }
    }

    private asComponentArray(): string[] {
        // Escape special characters for use in a regular expression
        const escapedDelimiter = this.escapeRegexInput(this.delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);

        // Create a regular expression that matches the delimiter, but avoids those preceded by the escape character
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
        const components = this.name.split(regex);
        return components.length > 1 ? components : [this.name];
    }

    // Escape all special characters in the input string for use in a regular expression
    private escapeRegexInput(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private assertIsValidDelimiter(delimiter: string): void {
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
    }

    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.length) {
            throw new Error("Index out of bounds.");
        }
    }

}