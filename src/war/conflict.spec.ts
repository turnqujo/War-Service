import { Card } from './card';
import { noContendersError, resolveConflict } from './conflict';
import { acceptCard, Player } from './player';

describe('Conflict resolution', () => {
  test('Should throw if given an empty array of contenders.', () =>
    expect(() => resolveConflict([], [])).toThrowError(noContendersError));

  test('Should return a winner with the correct winnings.', () => {
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };

    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 8 }, playerB);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 1 }, playerA);
    acceptCard({ suit: 2, rank: 10 }, playerB);

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
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };
    const playerC: Player = { name: 'Player C', hand: [] };

    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 8 }, playerB);
    acceptCard({ suit: 3, rank: 4 }, playerC);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 3 }, playerA);
    acceptCard({ suit: 2, rank: 6 }, playerB);
    acceptCard({ suit: 3, rank: 5 }, playerC);

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
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };

    // BATTLE # 1
    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 8 }, playerB);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 3 }, playerA);
    acceptCard({ suit: 2, rank: 3 }, playerB);

    // BATTLE # 2
    // Will be prize pool cards
    acceptCard({ suit: 3, rank: 10 }, playerA);
    acceptCard({ suit: 4, rank: 1 }, playerB);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 7 }, playerB);

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
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };
    const playerC: Player = { name: 'Player C', hand: [] };

    // BATTLE # 1
    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 8 }, playerB);
    acceptCard({ suit: 3, rank: 8 }, playerC);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 1 }, playerA);
    acceptCard({ suit: 2, rank: 1 }, playerB);
    acceptCard({ suit: 3, rank: 1 }, playerC);

    // BATTLE # 2
    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 3 }, playerA);
    acceptCard({ suit: 2, rank: 3 }, playerB);
    acceptCard({ suit: 3, rank: 3 }, playerC);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 4 }, playerA);
    acceptCard({ suit: 2, rank: 7 }, playerB);
    acceptCard({ suit: 3, rank: 2 }, playerC);

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
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };
    const playerC: Player = { name: 'Player C', hand: [] };

    // BATTLE # 1
    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 3 }, playerA);
    acceptCard({ suit: 2, rank: 8 }, playerB);
    acceptCard({ suit: 3, rank: 8 }, playerC);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 2 }, playerA);
    acceptCard({ suit: 2, rank: 2 }, playerB);
    acceptCard({ suit: 3, rank: 1 }, playerC);

    // BATTLE # 2
    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 4 }, playerA);
    acceptCard({ suit: 2, rank: 4 }, playerB);

    // The cards which will be played in battle
    acceptCard({ suit: 1, rank: 1 }, playerA);
    acceptCard({ suit: 2, rank: 7 }, playerB);

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

    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 4 }, playerA);
    acceptCard({ suit: 2, rank: 7 }, playerB);

    // No more cards added; both players will run out of cards at the same time.

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winnings.length).toBe(4);
  });

  test('Should return a winner if a contender runs out of cards early', () => {
    const playerA: Player = { name: 'Player A', hand: [] };
    const playerB: Player = { name: 'Player B', hand: [] };

    // The cards which started the conflict
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    acceptCard({ suit: 1, rank: 4 }, playerA);
    acceptCard({ suit: 2, rank: 7 }, playerB);

    // Only player B will have enough cards
    acceptCard({ suit: 2, rank: 8 }, playerB);

    const result = resolveConflict(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.winnings.length).toBe(5);
  });
});
