import { Card } from "./card";

describe("The War Card", () => {
  it("Should at least compile", () => {
    const subject = new Card();
    expect(subject).toBeTruthy();
  });
});
