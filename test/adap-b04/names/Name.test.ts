import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
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
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
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
    n["components"][1] = "ab.cd";
    expect(() => n.insert(1, "cs")).toThrowError(InvalidStateException);
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});
