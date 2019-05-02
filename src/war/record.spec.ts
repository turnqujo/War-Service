import { isTurnRecord, TurnType, isGameRecord } from './record';

describe('Game Record Type Guard', () => {
  test('Should return true if the object is a valid game record.', () => {
    const subject: any = {
      numberOfRanks: 4,
      numberOfSuits: 13,
      turnRecords: [],
      seed: 'Hello'
    };

    expect(isGameRecord(subject)).toBe(true);
  });

  test('Should return false if the object is not a valid game record.', () => {
    const subject: any = {
      foo: 7,
      bar: 'asdf',
      turnRecords: []
    };

    expect(isGameRecord(subject)).toBe(false);
  });
});

describe('Turn Record Type Guard', () => {
  test('Should return true if the object is a valid turn record.', () => {
    const subject: any = {
      gameCompleted: false,
      nameOfWinner: null,
      playedCards: [],
      playersAtEndOfTurn: [],
      type: TurnType.preparation,
      winnings: []
    };

    expect(isTurnRecord(subject)).toBe(true);
  });

  test('Should return false if the object is not a valid turn record.', () => {
    const subject: any = {
      foo: 7,
      bar: 'asdf',
      winnings: []
    };

    expect(isTurnRecord(subject)).toBe(false);
  });
});
