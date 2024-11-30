import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(!bn.includes("/"), "Base name must not contain '/' character.");
        IllegalArgumentException.assertCondition(bn.trim() !== "", "Base name must not be empty string.");

        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);

        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Node must be child node to be removed.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}