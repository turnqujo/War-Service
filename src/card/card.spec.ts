import { Card } from "./card";

describe("The War Card", () => {
  it("Should at least compile", () => {
    const subject = new Card(0, 1);
    expect(subject).toBeTruthy();
  });

  it("Should calculate, store, and return its value", () => {
    const subject = new Card(4, 7);
    expect(subject.getValue()).toBe(4 * 7);
  });
});
