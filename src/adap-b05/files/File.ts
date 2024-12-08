import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        IllegalArgumentException.assert(this.doGetFileState() === FileState.CLOSED, "File must be closed before it can be opened.");

        // do something

        // Class Invariants
        this.assertClassInvariants();
    }

    public read(noBytes: number): Int8Array {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        IllegalArgumentException.assert(noBytes >= 0, "Number of bytes must not be a negative number.");

        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "File must be open before it can be closed.");

        // do something

        // Class Invariants
        this.assertClassInvariants();
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}