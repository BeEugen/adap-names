import { Node } from "./Node";
import { Directory } from "./Directory";
import { ExceptionType } from "../common/AssertionDispatcher";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        this.assertClassInvariants();

        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.assertClassInvariants();

        this.targetNode = target;

        this.assertClassInvariants();
    }

    public getBaseName(): string {
        this.assertClassInvariants();

        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        this.assertClassInvariants();
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION)

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);

        this.assertClassInvariants();
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}