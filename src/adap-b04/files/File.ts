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
        IllegalArgumentException.assertIsNotNullOrUndefined(baseName);
        IllegalArgumentException.assertIsNotNullOrUndefined(parent);
        IllegalArgumentException.assertCondition(!baseName.includes("/"), "Base name must not contain '/' character.");
        IllegalArgumentException.assertCondition(baseName.trim() !== "", "Base name must not be empty string.");

        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.CLOSED, "File must be closed before it can be opened.");

        // do something
    }

    public read(noBytes: number): Int8Array {
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.OPEN, "File must be open before it can be closed.");

        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}