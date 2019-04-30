import { Player } from "../../common/player/player";
import { skirmish, cardlessPlayersError } from "./skirmish";

describe('Skirmish resolution', () => {
  test('Should return the winner of a 1-player game correctly.', () => {
    const playerA = new Player('Player A');
    playerA.takeWithOwnership({ suit: 1, rank: 1 });

    const result = skirmish([playerA]);
    expect(result.resolution.winner).toEqual(playerA.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(1);
  });

  test('Should return the winner of a conflict-free skirmish.', () => {
    const playerA = new Player('Player A');
    playerA.takeWithOwnership({ suit: 1, rank: 1 });

    const playerB = new Player('Player B');
    playerB.takeWithOwnership({ suit: 1, rank: 2 });

    const result = skirmish([playerA, playerB]);
    expect(result.resolution.winner).toEqual(playerB.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(0);
    expect(result.handsAtEndOfTurn[playerB.name].length).toBe(2);
  });

  test('Should move to a conflict if two players tie in a skirmish.', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // Cards which should cause the conflict
    playerA.takeWithOwnership({ suit: 1, rank: 1 });
    playerB.takeWithOwnership({ suit: 2, rank: 1 });

    // Cards which will be used as prizes in the conflict
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 2 });

    // Cards which will be played during the conflict
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 3 });

    const result = skirmish([playerA, playerB]);
    expect(result.resolution.winner).toEqual(playerA.name);
    expect(result.handsAtEndOfTurn[playerA.name].length).toBe(6);
  });

  test('Should throw if given a roster of card-less players (somehow).', () =>
    expect(() => skirmish([new Player('Player A'), new Player('Player B')])).toThrowError(cardlessPlayersError));
});
