import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

describe("Basic StringName function tests", () => {
    it("test set", () => {
        let n: Name = new StringName("oss.fau.de");
        let setResult: Name = n.setComponent(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(setResult.asString()).toBe("oss.cs.de");
    });
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        let insertResult: Name = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(insertResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        let appendResult: Name = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau");
        expect(appendResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        let removeResult: Name = n.remove(0);
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(removeResult.asString()).toBe("cs.fau.de");
    });
    it("test concat", () => {
        let n1: Name = new StringName("oss.cs");
        let n2: Name = new StringArrayName(["fau.de"], "/");
        let concatResult: Name = n1.concat(n2);
        expect(n1.asString()).toBe("oss.cs");
        expect(concatResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test illegal constructor", () => {
        expect(() => new StringName("oss.cs", "##")).toThrowError(IllegalArgumentException);
    });
    it("test illegal append", () => {
        let n: Name = new StringName("oss.cs");
        expect(() => n.append("fau.de")).toThrowError(IllegalArgumentException);
    });
    it("test invalid state", () => {
        let n: Name = new StringName("oss.fau.de");
        n["delimiter"] = "##";
        expect(() => n.insert(1, "cs")).toThrowError(InvalidStateException);
    });
});

describe("Basic StringArrayName function tests", () => {
    it("test set", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        let setResult: Name = n.setComponent(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(setResult.asString()).toBe("oss.cs.de");
    });
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        let insertResult: Name = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(insertResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        let appendResult: Name = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau");
        expect(appendResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        let removeResult: Name = n.remove(0);
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(removeResult.asString()).toBe("cs.fau.de");
    });
    it("test concat", () => {
        let n1: Name = new StringArrayName(["oss", "cs"]);
        let n2: Name = new StringName("fau.de", "/");
        let concatResult: Name = n1.concat(n2);
        expect(n1.asString()).toBe("oss.cs");
        expect(concatResult.asString()).toBe("oss.cs.fau.de");
    });
    it("test illegal constructor", () => {
        expect(() => new StringArrayName(["oss", "cs", "fau.de"])).toThrowError(IllegalArgumentException);
    });
    it("test illegal append", () => {
        let n: Name = new StringArrayName(["oss", "cs"]);
        expect(() => n.append("fau.de")).toThrowError(IllegalArgumentException);
    });
    it("test invalid state", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        n["delimiter"] = "##";
        expect(() => n.insert(1, "cs")).toThrowError(InvalidStateException);
    });
});

describe("Delimiter function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss#fau#de", '#');
        let insertResult: Name = n.insert(1, "cs");
        expect(n.asString()).toBe("oss#fau#de");
        expect(insertResult.asString()).toBe("oss#cs#fau#de");
    });
});

describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");
        let appendResult: Name = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(appendResult.asString()).toBe("oss.cs.fau.de#people");
    });
});
