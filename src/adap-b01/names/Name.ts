export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    /** Returns human-readable representation of Name instance */
    public asNameString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
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

    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
    }
    
}