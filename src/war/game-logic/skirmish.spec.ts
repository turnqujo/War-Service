import { Player, acceptCard } from '../../common/player/player';
import { skirmish, cardlessPlayersError } from './skirmish';

describe('Skirmish resolution', () => {
  test('Should return the winner of a 1-player game correctly.', () => {
    const playerA: Player = { name: 'Player A', hand: [] };
    acceptCard({ suit: 1, rank: 1 }, playerA);

    const result = skirmish([playerA]);
    expect(result.resolution.winner).toEqual(playerA.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(1);
  });

  test('Should return the winner of a conflict-free skirmish.', () => {
    const playerA: Player = { name: 'Player A', hand: [] };
    acceptCard({ suit: 1, rank: 1 }, playerA);

    const playerB: Player = { name: 'Player B', hand: [] };
    acceptCard({ suit: 1, rank: 2 }, playerB);

    const result = skirmish([playerA, playerB]);
    expect(result.resolution.winner).toEqual(playerB.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(0);
    expect(result.handsAtEndOfTurn[playerB.name].length).toBe(2);
  });

  test('Should move to a conflict if two players tie in a skirmish.', () => {
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };

    // Cards which should cause the conflict
    acceptCard({ suit: 1, rank: 1 }, playerA);
    acceptCard({ suit: 2, rank: 1 }, playerB);

    // Cards which will be used as prizes in the conflict
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 2 }, playerB);

    // Cards which will be played during the conflict
    acceptCard({ suit: 1, rank: 4 }, playerA);
    acceptCard({ suit: 2, rank: 3 }, playerB);

    const result = skirmish([playerA, playerB]);
    expect(result.resolution.winner).toEqual(playerA.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(6);
  });

  test('Should throw if given a roster of card-less players (somehow).', () => {
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player A', hand: [] }];
    expect(() => skirmish(roster)).toThrowError(cardlessPlayersError);
  });
});
