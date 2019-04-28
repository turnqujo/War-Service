import { Player, PlayerErrors } from './player';
import { Card } from '../models/card';

describe('The Player', () => {
  it('Should attach its name as the last player to a card when it is played.', () => {
    const subject = new Player('Player A');
    subject.receiveCard({ suit: 1, rank: 1, owner: 'Player B', playedBy: 'Player B' });
    expect(subject.playCard()).toEqual({ suit: 1, rank: 1, owner: 'Player B', playedBy: subject.name });
  });

  it('Should accept and return cards in first-in-first-out order.', () => {
    const subject = new Player('Player A');
    const exampleCards: Card[] = [{ owner: 'Player B', suit: 1, rank: 1 }, { suit: 1, rank: 2 }];
    exampleCards.forEach((card: Card) => subject.receiveCard(card));

    const expectedCards: Card[] = [
      { suit: 1, rank: 1, owner: 'Player B', playedBy: subject.name },
      { suit: 1, rank: 2, playedBy: subject.name }
    ];
    expectedCards.forEach((card: Card) => {
      expect(subject.playCard()).toEqual(card);
    });
  });

  it('Should take ownership of a given card if asked, and return them in first-in-first-out order.', () => {
    const subject = new Player('Some Player');
    const exampleCards: Card[] = [{ suit: 1, rank: 1 }, { suit: 1, rank: 2 }, { suit: 1, rank: 3 }];
    exampleCards.forEach((card: Card) => subject.takeWithOwnership(card));

    const expectedCards: Card[] = [
      { suit: 1, rank: 1, owner: subject.name, playedBy: subject.name },
      { suit: 1, rank: 2, owner: subject.name, playedBy: subject.name }
    ];
    expectedCards.forEach((card: Card) => {
      expect(subject.playCard()).toEqual(card);
    });
  });

  it('Should throw if asked to take ownership of an owned card.', () => {
    const subject = new Player('Player A');
    expect(() => subject.takeWithOwnership({ rank: 1, suit: 1, owner: 'Player B' })).toThrowError(
      PlayerErrors.alreadyOwned
    );
  });

  it('Should throw if asked to play a card with none left in hand.', () => {
    const subject = new Player('Some Player');
    subject.receiveCard({ suit: 1, rank: 1 });
    subject.playCard();
    expect(() => subject.playCard()).toThrowError(PlayerErrors.outOfCards);
  });

  it('Should expose the number of cards it has in hand.', () => {
    const subject = new Player('Some Player');
    subject.receiveCard({ suit: 1, rank: 1 });
    subject.receiveCard({ suit: 1, rank: 2 });
    expect(subject.getHandSize()).toBe(2);
  });
});
