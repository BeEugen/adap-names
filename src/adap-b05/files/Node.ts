import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Exception } from "../common/Exception";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.assertClassInvariants();

        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;

        this.assertClassInvariants();
    }

    public getFullName(): Name {
        this.assertClassInvariants();

        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        this.assertClassInvariants();

        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertClassInvariants();
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION)

        this.doSetBaseName(bn);

        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.assertClassInvariants();

        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        this.assertClassInvariants();

        try {
            const result: Set<Node> = new Set<Node>();
            const matches = this.findNodesUnchecked(bn);
            matches.forEach(match => result.add(match));

            this.assertClassInvariants();
            return result;
        } catch (ex) {
            throw new ServiceFailureException("Error occured in find nodes operation.", ex as Exception);
        }
    }

    public findNodesUnchecked(bn: string): Set<Node> {
        this.assertClassInvariants();

        const result: Set<Node> = new Set<Node>();
        if (this.doGetBaseName() === bn) {
            result.add(this);
        }

        this.assertClassInvariants();
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}
