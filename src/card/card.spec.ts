import { Card } from "./card";

describe("The War Card", () => {
  it("Should at least compile", () => {
    const subject = new Card(10, 1);
    expect(subject).toBeTruthy();
  });

  it("Should calculate, store, and return its value", () => {
    const subject = new Card(4, 5);
    expect(subject.getValue()).toBe(20);
  });

  it("Should throw if given invalid input", () => {
    expect(() => new Card("asdf" as any, 2)).toThrow();
    expect(() => new Card(2, -20)).toThrow();
  });
});
