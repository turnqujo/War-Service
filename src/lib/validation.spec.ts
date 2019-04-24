import { isValidPositiveInt } from "./validation";

describe("Number Validation", () => {
  it("Should pass for positive integers", () => {
    expect(isValidPositiveInt(10)).toBe(true);
  });

  it("Should not allow negative numbers", () => {
    expect(isValidPositiveInt(-100)).toBe(false);
  });

  it("Should not allow strings, even if they could be converted to numbers", () => {
    expect(isValidPositiveInt("asdf" as any)).toBe(false);
    expect(isValidPositiveInt("10" as any)).toBe(false);
  });

  it("Should only accept whole numbers", () => {
    expect(isValidPositiveInt(10.2)).toBe(false);
  });
});
