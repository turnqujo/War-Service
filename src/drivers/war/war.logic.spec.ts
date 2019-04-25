import { Card } from '../../card/card';
import { IOwnedCard } from '../../card/owned-card';
import { Player } from '../../player/player';
import * as warLogic from './war.logic';

describe('Determining winning cards logic for War', () => {
  it('Should return a winning card out of a set of non-tied cards', () => {
    const playedCards: IOwnedCard[] = [
      { owner: new Player('Player A'), card: new Card(2, 10) },
      { owner: new Player('Player B'), card: new Card(2, 8) }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(playedCards[0]);
  });

  it('Should return multiple winning cards if there is a tie', () => {
    const playedCards: IOwnedCard[] = [
      { owner: new Player('Player A'), card: new Card(2, 8) },
      { owner: new Player('Player B'), card: new Card(2, 8) }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(2);
  });

  it('Should return one winning card, even if there is a lower-value tie', () => {
    const playedCards: IOwnedCard[] = [
      { owner: new Player('Player A'), card: new Card(1, 10) },
      { owner: new Player('Player B'), card: new Card(2, 8) },
      { owner: new Player('Player C'), card: new Card(3, 8) }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0].card.getRank()).toBe(10);
  });

  it('Should be able to handle n-way ties', () => {
    const playedCards: IOwnedCard[] = [
      { owner: new Player('Player A'), card: new Card(2, 8) },
      { owner: new Player('Player B'), card: new Card(2, 8) },
      { owner: new Player('Player C'), card: new Card(2, 8) }
    ];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(3);
  });

  it('Should handle a one-player situation (they win)', () => {
    const playedCards: IOwnedCard[] = [{ owner: new Player('Player A'), card: new Card(2, 8) }];

    const result = warLogic.findWinningCards(playedCards);
    expect(result.length).toBe(1);
  });

  it('Should return an empty array if given an empty array', () => {
    const playedCards: IOwnedCard[] = [];

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
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 10));

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) }
    ];

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
    expect(result.spoils.length).toBe(6);
  });

  it('Should handle 3+ player wars', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));
    playerC.receiveCard(new Card(3, 4));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 10));
    playerC.receiveCard(new Card(2, 8));

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) },
      { owner: playerC, card: new Card(3, 10) }
    ];

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
    expect(result.spoils.length).toBe(9);
  });

  it('Should handle multi-battle wars', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 1));

    // BATTLE # 2
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 4));
    playerB.receiveCard(new Card(3, 6));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 7));

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) }
    ];

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
    expect(result.spoils.length).toBe(10);
  });

  it('Should handle multi-battle, many-player wars', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));
    playerC.receiveCard(new Card(4, 8));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 1));
    playerC.receiveCard(new Card(4, 1));

    // BATTLE # 2
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 4));
    playerB.receiveCard(new Card(3, 6));
    playerC.receiveCard(new Card(4, 3));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 7));
    playerC.receiveCard(new Card(4, 4));

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) },
      { owner: playerC, card: new Card(3, 10) }
    ];

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
    expect(result.spoils.length).toBe(15);
  });

  it('Should handle multi-battle, many-player wars where one player loses early', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');
    const playerC = new Player('Player C');

    // BATTLE # 1
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));
    playerC.receiveCard(new Card(4, 8));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(2, 2));
    playerC.receiveCard(new Card(4, 1));

    // BATTLE # 2
    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 4));
    playerB.receiveCard(new Card(3, 6));

    // The cards which will be played in battle
    playerA.receiveCard(new Card(1, 1));
    playerB.receiveCard(new Card(2, 7));

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) },
      { owner: playerC, card: new Card(3, 10) }
    ];

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
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
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) }
    ];

    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));

    // No more cards added; both players will run out of cards at the same time.

    const result = warLogic.resolveWar(playedCards);
    expect(result.spoils.length).toBe(4);
  });

  it('Should return a winner if a contender runs out of cards early', () => {
    const playerA = new Player('Player A');
    const playerB = new Player('Player B');

    // The cards which started the war
    const playedCards: IOwnedCard[] = [
      { owner: playerA, card: new Card(2, 10) },
      { owner: playerB, card: new Card(1, 10) }
    ];

    // Will be prize pool cards
    playerA.receiveCard(new Card(1, 2));
    playerB.receiveCard(new Card(3, 8));

    // Only player B will have enough cards
    playerB.receiveCard(new Card(2, 12));

    const result = warLogic.resolveWar(playedCards);
    expect(result.winner.getName()).toBe(playerB.getName());
    expect(result.spoils.length).toBe(5);
  });
});

describe('Victory condition logic for War', () => {
  it('Should return the winning player if there is only one player left', () => {
    expect(warLogic.findWinningPlayer([new Player('Player A')])).not.toBeNull();
  });

  it('Should return the winning player if they are the only one with cards left', () => {
    const player = new Player('I am gonna win!');
    player.receiveCard(new Card(4, 2));
    const roster = [player, new Player('I am out of cards!')];

    expect(warLogic.findWinningPlayer(roster)).toEqual(player);
  });

  it('Should throw if given an empty roster', () => {
    expect(() => warLogic.findWinningPlayer([])).toThrowError(warLogic.findWinningPlayerErrors.emptyRoster);
  });
});
