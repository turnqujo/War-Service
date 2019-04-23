import { Deck } from "./deck";

describe("The War Card Deck", () => {
  it("Should at least compile", () => {
    const subject = new Deck();
    expect(subject).toBeTruthy();
  });
});
