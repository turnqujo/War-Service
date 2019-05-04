import { createGame } from './create-game';
import { WarOptionValidationError } from './validation/war-options';

describe('Creating a new game of War', () => {
  test('Should not accept invalid input', () => {
    expect(() => createGame('asdf' as any, 13, 2)).toThrowError(WarOptionValidationError.invalidSuitCount);
    expect(() => createGame(4, -13, 2)).toThrowError(WarOptionValidationError.invalidRankCount);
    expect(() => createGame(4, 13, '2' as any)).toThrowError(WarOptionValidationError.invalidPlayerCount);
    expect(() => createGame(4, 13, 3)).toThrowError(WarOptionValidationError.cannotSplitDeckEvenly);
  });

  test('Should create a new game record object as expected.', () => {
    const subject = createGame(4, 13, 2);
    expect(subject.numberOfSuits).toBe(4);
    expect(subject.numberOfRanks).toBe(13);
    expect(subject.turnRecords[0].playersAtEndOfTurn[0].hand.length).toBe(26);
    expect(subject.turnRecords[0].playersAtEndOfTurn[1].hand.length).toBe(26);
  });

  test('Should preserve a seed if given', () => {
    const subject = createGame(4, 13, 2, 'I am seed!');
    expect(subject.seed).toBe('I am seed!');
  });
});
