import { Node } from "./Node";
import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertClassInvariants();

        this.childNodes.add(cn);

        this.assertClassInvariants();
    }

    public remove(cn: Node): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "Node must be a child node to be removed.");

        this.childNodes.delete(cn); // Yikes! Should have been called remove

        this.assertClassInvariants();
    }

    public findNodesUnchecked(bn: string): Set<Node> {
        this.assertClassInvariants();

        const result: Set<Node> = new Set<Node>();
        if (this.doGetBaseName() === bn) {
            result.add(this);
        }
        for (const child of this.childNodes) {
            const matches = child.findNodesUnchecked(bn);
            matches.forEach(match => result.add(match));
        }

        this.assertClassInvariants();
        return result;
    }

}