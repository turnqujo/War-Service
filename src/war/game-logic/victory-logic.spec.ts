import { checkForVictory } from './victory-logic';
import { Player } from '../../common/player/player';

describe('Victory condition logic for War', () => {
  test('Should return true if there is only one player left', () => {
    const roster: Player[] = [{ name: 'Player A', hand: [] }];
    expect(checkForVictory(roster)).toBe(true);
  });

  test('Should return the winning player if they are the only one with cards left', () => {
    const roster: Player[] = [
      { name: 'Player A', hand: [{ suit: 4, rank: 2, owner: 'Player A' }] },
      { name: 'Player B', hand: [] }
    ];

    expect(checkForVictory(roster)).toBe(true);
  });

  test('Should return true if given an empty roster', () => {
    expect(checkForVictory([])).toBe(true);
  });
});
