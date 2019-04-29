import { Card } from '../../../models/card';
import { Player } from '../../../player/player';
import * as warLogic from './war.logic';

describe('Determining winning cards logic for War', () => {
  it('Should return a winning card out of a set of non-tied cards', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 10 }, { owner: 'Player B', suit: 2, rank: 8 }];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(playedCards[0]);
  });

  it('Should return multiple winning cards if there is a tie', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 8 }, { owner: 'Player B', suit: 1, rank: 8 }];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(2);
  });

  it('Should return one winning card, even if there is a lower-value tie', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 10 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0].rank).toBe(10);
  });

  it('Should be able to handle n-way ties', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 8 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(3);
  });

  it('Should handle a one-player situation (they win)', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 1, rank: 8 }];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
  });

  it('Should return an empty array if given an empty array', () => {
    const playedCards: Card[] = [];

    expect(() => {
      const result = warLogic.findWinningCards(playedCards);
      expect(result.length).toBe(0);
    }).not.toThrow();
  });
});

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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB, playerC]);
    expect(result.winner.name).toBe(playerB.name);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB]);
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

    const result = warLogic.resolveWar(playedCards, [playerA, playerB]);
    expect(result.winner.name).toBe(playerB.name);
    expect(result.spoils.length).toBe(5);
  });
});

describe('Victory condition logic for War', () => {
  it('Should return the winning player if there is only one player left', () => {
    expect(warLogic.checkForVictory([new Player('Player A')])).not.toBeNull();
  });

  it('Should return the winning player if they are the only one with cards left', () => {
    const player = new Player('I am gonna win!');
    player.takeWithOwnership({ suit: 4, rank: 2 });
    const roster = [player, new Player('I am out of cards!')];

    expect(warLogic.checkForVictory(roster)).toEqual(player);
  });

  it('Should throw if given an empty roster', () => {
    expect(() => warLogic.checkForVictory([])).toThrowError(warLogic.checkForVictoryErrors.emptyRoster);
  });
});

describe('Awarding cards to a player', () => {
  it('Should award cards to a player without altering ownership', () => {
    const subject = new Player('I won!');
    const prizes: Card[] = [
      { owner: 'Other Player', suit: 1, rank: 1 },
      { owner: 'Someone Else', suit: 1, rank: 1 },
      { owner: subject.name, suit: 1, rank: 1 }
    ];

    warLogic.awardCardsToPlayer(prizes, subject);

    prizes.forEach((prize: Card) => {
      const playedCard: Card = { ...prize, playedBy: subject.name };
      expect(subject.playCard()).toEqual(playedCard);
    });
  });
});
