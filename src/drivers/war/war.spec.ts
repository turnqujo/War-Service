import { War, WarErrors } from './war';

describe('The War driver program', () => {
  it('Should at least exist.', () => {
    const subject = new War();
    expect(subject).toBeTruthy();
  });

  it('Should play a standard game', () => {
    const subject = new War();
    expect(() => subject.play(4, 13, 2)).not.toThrow();
  });

  it('Should handle playing a game with the minimum possible values', () => {
    const subject = new War();
    expect(() => subject.play(1, 1, 1)).not.toThrow();
  });

  it('Should be able to play a game with lots of players', () => {
    const subject = new War();
    expect(() => subject.play(12, 39, 12)).not.toThrow();
  });

  it('Should play a game which only has wars.', () => {
    const subject = new War();
    expect(() => subject.play(52, 1, 2)).not.toThrow();
  });

  it('Should play a game which cannot have wars.', () => {
    const subject = new War();
    expect(() => subject.play(1, 52, 2)).not.toThrow();
  });

  it('Should not accept invalid input', () => {
    const subject = new War();
    expect(() => subject.play('asdf' as any, 13, 2)).toThrowError(WarErrors.invalidNumSuits);
    expect(() => subject.play(4, -13, 2)).toThrowError(WarErrors.invalidNumRanks);
    expect(() => subject.play(4, 13, '2' as any)).toThrowError(WarErrors.invalidNumPlayers);
  });

  it('Should throw if the deck cannot be split between all players evenly', () => {
    const subject = new War();
    expect(() => subject.play(4, 13, 3)).toThrowError(WarErrors.cannotSplitEvenly);
  });
});
