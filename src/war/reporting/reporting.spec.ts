import { Player } from '../../common/player/player';
import { buildHandLookup } from './reporting';
import { HandLookup } from './turn-outcome';

describe('Building the hand lookup', () => {
  test('Should construct a dictionary of player name to an array of cards', () => {
    const playerA: Player = {
      name: 'Player A',
      hand: [{ suit: 1, rank: 2, owner: 'Player A' }, { suit: 3, rank: 4, owner: 'Player A' }]
    };
    const playerB: Player = {
      name: 'Player B',
      hand: [{ suit: 5, rank: 6, owner: 'Player B' }, { suit: 7, rank: 8, owner: 'Player B' }]
    };

    const expectedOutput: HandLookup = {
      [playerA.name]: [{ suit: 1, rank: 2, owner: playerA.name }, { suit: 3, rank: 4, owner: playerA.name }],
      [playerB.name]: [{ suit: 5, rank: 6, owner: playerB.name }, { suit: 7, rank: 8, owner: playerB.name }]
    };

    expect(buildHandLookup([playerA, playerB])).toEqual(expectedOutput);
  });
});
