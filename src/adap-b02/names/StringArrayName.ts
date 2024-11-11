import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter) {
            this.assertIsValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter);
        return this.components
            .map(c => c.split(ESCAPE_CHARACTER).join("")) // unmask components
            .join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds.");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        if (other.isEmpty()) {
            return;
        }
        const otherName = other.asDataString();
        const otherDelimiter = other.getDelimiterCharacter();
        let otherComponents = this.split(otherName, otherDelimiter);
        // Replace other delimiter by this delimiter
        otherComponents = otherComponents.map(c => c.split(otherDelimiter).join(this.delimiter));
        this.components = this.components.concat(otherComponents);
    }

    private split(name: string, delimiter: string): string[] {
        // Escape special characters for use in a regular expression
        const escapedDelimiter = this.escapeRegexInput(delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);

        // Create a regular expression that matches the delimiter, but avoids those preceded by the escape character
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
        const components = name.split(regex);
        return components.length > 1 ? components : [name];
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
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds.");
        }
    }

}