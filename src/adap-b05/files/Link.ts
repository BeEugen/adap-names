import { Node } from "./Node";
import { Directory } from "./Directory";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        // Class Invariants
        this.assertClassInvariants();

        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(target);

        this.targetNode = target;

        // Class Invariants
        this.assertClassInvariants();
    }

    public getBaseName(): string {
        // Class Invariants
        this.assertClassInvariants();

        const target = this.ensureTargetNode(this.targetNode);
        const result = target.getBaseName();

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public rename(bn: string): void {
        // Class Invariants
        this.assertClassInvariants();

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);

        // Class Invariants
        this.assertClassInvariants();
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}