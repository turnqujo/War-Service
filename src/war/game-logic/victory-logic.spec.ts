import { checkForVictory } from './victory-logic';
import { Player } from '../../common/player/player';

describe('Victory condition logic for War', () => {
  test('Should return the winning player if there is only one player left', () => {
    const roster: Player[] = [{ name: 'Player A', hand: [] }];
    expect(checkForVictory(roster)).not.toBeNull();
  });

  test('Should return the winning player if they are the only one with cards left', () => {
    const player: Player = { name: 'Player A', hand: [{ suit: 4, rank: 2, owner: 'Player A' }] };
    const cardlessPlayer: Player = { name: 'Player B', hand: [] };
    const roster = [player, cardlessPlayer];

    expect(checkForVictory(roster)).toEqual(player);
  });

  test('Should return null if given an empty roster', () => {
    expect(checkForVictory([])).toBeNull();
  });
});
