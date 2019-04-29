import { Player } from '../../common/player/player';
import { buildHandLookup } from './reporting';
import { HandLookup } from './turn-outcome';

describe('Building the hand lookup', () => {
  it('Should construct a dictionary of player name to an array of cards', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerA.takeWithOwnership({ suit: 3, rank: 4 });
    playerB.takeWithOwnership({ suit: 5, rank: 6 });
    playerB.takeWithOwnership({ suit: 7, rank: 8 });

    const expectedOutput: HandLookup = {
      [playerA.name]: [
        { suit: 1, rank: 2, owner: playerA.name },
        { suit: 3, rank: 4, owner: playerA.name }
      ],
      [playerB.name]: [
        { suit: 5, rank: 6, owner: playerB.name },
        { suit: 7, rank: 8, owner: playerB.name }
      ]
    };

    expect(buildHandLookup([playerA, playerB])).toEqual(expectedOutput);
  });
});