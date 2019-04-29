import { checkForVictory } from './victory-logic';
import { Player } from '../../common/player/player';

describe('Victory condition logic for War', () => {
  test('Should return the winning player if there is only one player left', () => {
    expect(checkForVictory([new Player('Player A')])).not.toBeNull();
  });

  test('Should return the winning player if they are the only one with cards left', () => {
    const player = new Player('I am gonna win!');
    player.takeWithOwnership({ suit: 4, rank: 2 });
    const roster = [player, new Player('I am out of cards!')];

    expect(checkForVictory(roster)).toEqual(player);
  });

  test('Should return null if given an empty roster', () => {
    expect(checkForVictory([])).toBeNull();
  });
});
