import { WarOptionValidationError } from './options-validation';
import { playWar } from './war';

describe('The War driver program', () => {
  test('Should play a standard game', () => {
    expect(() => playWar(4, 13, 2, 'Standard game seed')).not.toThrow();
  });

  test('Should handle playing a game with the minimum possible values', () => {
    expect(() => playWar(1, 1, 1, 'Minimalist game seed')).not.toThrow();
  });

  test('Should be able to play a game with lots of players', () => {
    expect(() => playWar(8, 26, 4, 'Gigantic game seed')).not.toThrow();
  });

  test('Should play a game which only has conflicts.', () => {
    expect(() => playWar(52, 1, 2, 'Battle-royale game seed')).not.toThrow();
  });

  test('Should play a game which cannot have conflicts.', () => {
    expect(() => playWar(1, 52, 2, 'Creative mode game seed')).not.toThrow();
  });

  test('Should not accept invalid input', () => {
    expect(() => playWar('asdf' as any, 13, 2)).toThrowError(WarOptionValidationError.invalidSuitCount);
    expect(() => playWar(4, -13, 2)).toThrowError(WarOptionValidationError.invalidRankCount);
    expect(() => playWar(4, 13, '2' as any)).toThrowError(WarOptionValidationError.invalidPlayerCount);
    expect(() => playWar(4, 13, 3)).toThrowError(WarOptionValidationError.cannotSplitDeckEvenly);
  });

  test('Should preserve turn records, avoiding mutation', () => {
    const subject = playWar(4, 13, 2);
    expect(subject.turnRecords[0]).not.toBeNull();
    expect(subject.turnRecords.shift()).not.toEqual(subject.turnRecords.pop());
  });
});
