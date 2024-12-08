import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);

        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);

        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(cn);
        IllegalArgumentException.assert(this.hasChildNode(cn), "Node must be child node to be removed.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}