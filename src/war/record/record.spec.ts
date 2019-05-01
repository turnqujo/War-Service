import { isTurnRecord, TurnType } from './record';

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
