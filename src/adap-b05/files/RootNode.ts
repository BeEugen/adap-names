import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        // Class Invariants
        this.assertClassInvariants();

        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // Preconditions
        throw new IllegalArgumentException("The root directory is not allowed to be moved into another directory.");

        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected assertIsValidBaseNameAsPrecondition(bn: string): void {
        const condition: boolean = (bn === "");
        IllegalArgumentException.assert(condition, "Invalid base name.");
    }

    protected assertClassInvariants(): void {
        const condition: boolean = (this.doGetBaseName() === "");
        InvalidStateException.assert(condition, "Invalid State.");
    }

}