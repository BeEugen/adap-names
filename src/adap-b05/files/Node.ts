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
        // Preconditions
        this.assertIsValidBaseNameAsPrecondition(bn);
        this.assertIsNotNullOrUndefinedAsPrecondition(pn);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(to);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        // Class Invariants
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        // Class Invariants
        this.assertClassInvariants();

        const result: Name = this.parentNode.getFullName();
        console.log("Einzeln: " + result);
        result.append(this.getBaseName());

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    public getBaseName(): string {
        // Class Invariants
        this.assertClassInvariants();

        const result = this.doGetBaseName();

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        // Class Invariants
        this.assertClassInvariants();
        // Preconditions
        this.assertIsValidBaseNameAsPrecondition(bn);

        this.doSetBaseName(bn);

        // Class Invariants
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        // Class Invariants
        this.assertClassInvariants();

        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        // Class Invariants
        this.assertClassInvariants();

        try {
            const result: Set<Node> = new Set<Node>();
            const matches = this.findNodesUnchecked(bn);
            matches.forEach(match => result.add(match));

            // Class Invariants
            this.assertClassInvariants();
            return result;
        } catch (ex) {
            throw new ServiceFailureException("Error occured in find nodes operation.", ex as Exception);
        }
    }

    public findNodesUnchecked(bn: string): Set<Node> {
        // Class Invariants
        this.assertClassInvariants();

        const result: Set<Node> = new Set<Node>();
        if (this.doGetBaseName() === bn) {
            result.add(this);
        }

        // Class Invariants
        this.assertClassInvariants();
        return result;
    }

    protected assertIsValidBaseNameAsPrecondition(bn: string): void {
        const condition: boolean = (bn.trim() !== "");
        IllegalArgumentException.assert(condition, "Invalid base name.");
    }

    protected assertIsNotNullOrUndefinedAsPrecondition(arg: any): void {
        const condition: boolean = (arg !== null) && (arg !== undefined);
        IllegalArgumentException.assert(condition, "Argument must not be null or undefined.");
    }

    protected assertClassInvariants(): void {
        const condition: boolean = (this.doGetBaseName().trim() !== "");
        InvalidStateException.assert(condition, "Invalid state.");
    }

}
