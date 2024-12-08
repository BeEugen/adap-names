import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);

        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);

        this.childNodes.add(cn);

        // Class Invariants
        this.assertClassInvariants();
    }

    public removeChildNode(cn: Node): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);
        IllegalArgumentException.assert(this.hasChildNode(cn), "Node must be child node to be removed.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove

        // Class Invariants
        this.assertClassInvariants();
    }

    public findNodesUnchecked(bn: string): Set<Node> {
        // Class Invariants
        this.assertClassInvariants();

        const result: Set<Node> = new Set<Node>();
        if (this.doGetBaseName() === bn) {
            result.add(this);
        }
        for (const child of this.childNodes) {
            const matches = child.findNodesUnchecked(bn);
            matches.forEach(match => result.add(match));
        }

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

}