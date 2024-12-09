import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

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
        // Preconditions
        this.assertIsNotNullOrUndefinedAsPrecondition(to);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        // Preconditions
        this.assertIsValidBaseNameAsPrecondition(bn);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    protected assertIsValidBaseNameAsPrecondition(bn: string): void {
        const condition: boolean = (bn.trim() !== "");
        IllegalArgumentException.assert(condition, "Invalid base name.");
    }

    protected assertIsNotNullOrUndefinedAsPrecondition(arg: any): void {
        const condition: boolean = (arg !== null) && (arg !== undefined);
        IllegalArgumentException.assert(condition, "Argument must not be null or undefined.");
    }

}
