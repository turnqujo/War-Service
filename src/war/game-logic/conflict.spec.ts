import { Card } from '../../common/card/card';
import { Player } from '../../common/player/player';
import { resolveConflict, noContendersError } from './conflict';

describe('Conflict resolution', () => {
  test('Should throw if given an empty array of contenders.', () =>
    expect(() => resolveConflict([], [])).toThrowError(noContendersError));

  test('Should return a winner with the correct winnings.', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 1 });
    playerB.takeWithOwnership({ suit: 2, rank: 10 });

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(6);
  });

  test('Should handle 3+ player conflicts', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });
    playerC.takeWithOwnership({ suit: 3, rank: 4 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 3 });
    playerB.takeWithOwnership({ suit: 2, rank: 6 });
    playerC.takeWithOwnership({ suit: 3, rank: 5 });

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveConflict(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(9);
  });

  test('Should handle multi-stage conflicts', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 3 });
    playerB.takeWithOwnership({ suit: 2, rank: 3 });

    // BATTLE # 2
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 3, rank: 10 });
    playerB.takeWithOwnership({ suit: 4, rank: 1 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(10);
  });

  test('Should handle multi-battle, many-player conflicts', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });
    playerC.takeWithOwnership({ suit: 3, rank: 8 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 1 });
    playerB.takeWithOwnership({ suit: 2, rank: 1 });
    playerC.takeWithOwnership({ suit: 3, rank: 1 });

    // BATTLE # 2
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 3 });
    playerB.takeWithOwnership({ suit: 2, rank: 3 });
    playerC.takeWithOwnership({ suit: 3, rank: 3 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });
    playerC.takeWithOwnership({ suit: 3, rank: 2 });

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveConflict(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(15);
  });

  test('Should handle multi-battle, many-player conflicts, in which one player loses early', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 3 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });
    playerC.takeWithOwnership({ suit: 3, rank: 8 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 2 });
    playerC.takeWithOwnership({ suit: 3, rank: 1 });

    // BATTLE # 2
    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 4 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 1 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveConflict(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(13);
  });

  test('Should return a random winner if all contenders do not have enough cards to battle', () => {
    /**
     * NOTE: This could legitimately happen:
     * - Four player game
     * - Two players both have two or fewer cards left
     * - They win against the other two players in a tie during a regular turn, starting a conflict
     * - They are in conflict without the minimum cards necessary to carry out even one round
     *
     * In a normal (2-person & 52-card deck) game of War, this can't happen.
     */

    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // No more cards added; both players will run out of cards at the same time.

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winnings.length).toBe(4);
  });

  test('Should return a winner if a contender runs out of cards early', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // Only player B will have enough cards
    playerB.takeWithOwnership({ suit: 2, rank: 8 });

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(5);
  });
});
