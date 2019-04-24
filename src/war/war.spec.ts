import { War, WarErrors } from "./war";

describe("The War driver program", () => {
  it("Should at least exist.", () => {
    const subject = new War();
    expect(subject).toBeTruthy();
  });

  it("Should not accept invalid input", () => {
    const subject = new War();
    expect(() => subject.play("asdf" as any, 13, 2)).toThrowError(
      WarErrors.invalidNumSuits
    );

    expect(() => subject.play(4, -13, 2)).toThrowError(
      WarErrors.invalidNumRanks
    );

    expect(() => subject.play(4, 13, "2" as any)).toThrowError(
      WarErrors.invalidNumPlayers
    );
  });

  it("Should throw if the deck cannot be split between all players evenly", () => {
    const subject = new War();
    expect(() => subject.play(4, 13, 3)).toThrowError(
      WarErrors.cannotSplitEvenly
    );
  });
});
