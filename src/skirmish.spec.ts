import { acceptCard, Player } from './player';
import { cardlessPlayersError, skirmish } from './skirmish';

describe('Skirmish resolution', () => {
  test('Should return the winner of a 1-player game correctly.', () => {
    const playerA: Player = { name: 'Player A', hand: [{ suit: 1, rank: 1, owner: 'Player A' }] };

    const result = skirmish([playerA]);
    expect(result.nameOfWinner).toBe(playerA.name);
    expect(result.playersAtEndOfTurn.length).toBe(1);
    expect(result.playersAtEndOfTurn[0].hand.length).toBe(1);
  });

  test('Should return the winner of a conflict-free skirmish.', () => {
    const playerA: Player = { name: 'Player A', hand: [{ suit: 1, rank: 1, owner: 'Player A' }] };
    const playerB: Player = { name: 'Player B', hand: [{ suit: 1, rank: 2, owner: 'Player B' }] };

    const result = skirmish([playerA, playerB]);
    expect(result.nameOfWinner).toBe(playerB.name);
    expect(result.playersAtEndOfTurn[0].hand.length).toBe(0);
    expect(result.playersAtEndOfTurn[1].hand.length).toBe(2);
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
    expect(result.nameOfWinner).toBe(playerA.name);
    expect(result.playersAtEndOfTurn[0].hand.length).toBe(6);
    expect(result.playersAtEndOfTurn[1].hand.length).toBe(0);
  });

  test('Should throw if given a roster of card-less players (somehow).', () => {
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player A', hand: [] }];
    expect(() => skirmish(roster)).toThrowError(cardlessPlayersError);
  });
});
