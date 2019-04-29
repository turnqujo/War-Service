import { Card } from '../../common/card/card';
import { Player } from '../../common/player/player';
import { resolveWar } from './turn-logic';

describe('War resolution logic', () => {
  it('Should return a winner with the correct spoils', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 2 });
    playerB.takeWithOwnership({ suit: 2, rank: 8 });

    // The cards which will be played in battle
    playerA.takeWithOwnership({ suit: 1, rank: 1 });
    playerB.takeWithOwnership({ suit: 2, rank: 10 });

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    const result = resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(6);
  });

  it('Should handle 3+ player wars', () => {
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

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(9);
  });

  it('Should handle multi-battle wars', () => {
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

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    const result = resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(10);
  });

  it('Should handle multi-battle, many-player wars', () => {
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

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(15);
  });

  it('Should handle multi-battle, many-player wars where one player loses early', () => {
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

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 },
      { owner: playerC.name, suit: 3, rank: 10 }
    ];

    const result = resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(13);
  });

  it('Should return a random winner if all contenders do not have enough cards to battle', () => {
    /**
     * NOTE: This could legitimately happen:
     * - Four player game
     * - Two players both have two or fewer cards left
     * - They win against the other two players in a tie during a regular turn, entering war
     * - They are in war without the minimum cards necessary to carry out even one round
     *
     * In a normal (2-person & 52-card deck) game of War, this can't happen.
     */

    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // No more cards added; both players will run out of cards at the same time.

    const result = resolveWar(playedCards, [playerA, playerB]);
    expect(result.spoils.length).toBe(4);
  });

  it('Should return a winner if a contender runs out of cards early', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // The cards which started the war
    const playedCards: Card[] = [
      { owner: playerA.name, suit: 1, rank: 10 },
      { owner: playerB.name, suit: 2, rank: 10 }
    ];

    // Will be prize pool cards
    playerA.takeWithOwnership({ suit: 1, rank: 4 });
    playerB.takeWithOwnership({ suit: 2, rank: 7 });

    // Only player B will have enough cards
    playerB.takeWithOwnership({ suit: 2, rank: 8 });

    const result = resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner).toBe(playerB.name);
    expect(result.spoils.length).toBe(5);
  });
});
