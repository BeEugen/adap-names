import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";

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
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.doGetFileState() === FileState.CLOSED, "File must be closed before it can be opened.");
        // do something
        this.assertClassInvariants();
    }

    public read(noBytes: number): Int8Array {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, noBytes >= 0, "Number of bytes must not be a negative number.");

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

        this.assertClassInvariants();
        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.doGetFileState() === FileState.OPEN, "File must be open before it can be closed.");
        // do something
        this.assertClassInvariants();
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}