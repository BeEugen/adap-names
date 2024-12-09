import { Node } from "./Node";
import { Directory } from "./Directory";
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
        // Preconditions
        IllegalArgumentException.assert(this.doGetFileState() === FileState.CLOSED, "File must be closed before it can be opened.");

        // do something
    }

    public read(noBytes: number): Int8Array {
        // Preconditions
        IllegalArgumentException.assert(noBytes >= 0, "Number of bytes must not be a negative number.");

        // read something
        return new Int8Array();
    }

    public close(): void {
        // Preconditions
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "File must be open before it can be closed.");

        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}