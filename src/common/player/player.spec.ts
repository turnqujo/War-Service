import { Player, PlayerErrors } from './player';
import { Card } from '../card/card';

describe('The Player', () => {
  test('Should attach its name as the last player to a card when it is played.', () => {
    const subject = new Player('Player A');
    subject.receiveCard({ suit: 1, rank: 1, owner: 'Player B', playedBy: 'Player B' });
    expect(subject.playCard()).toEqual({ suit: 1, rank: 1, owner: 'Player B', playedBy: subject.name });
  });

  test('Should accept and return cards in first-in-first-out order.', () => {
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

  test('Should take ownership of a given card if asked, and return them in first-in-first-out order.', () => {
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

  test('Should throw if asked to take ownership of an owned card.', () => {
    const subject = new Player('Player A');
    expect(() => subject.takeWithOwnership({ rank: 1, suit: 1, owner: 'Player B' })).toThrowError(
      PlayerErrors.alreadyOwned
    );
  });

  test('Should throw if asked to play a card with none left in hand.', () => {
    const subject = new Player('Some Player');
    subject.receiveCard({ suit: 1, rank: 1 });
    subject.playCard();
    expect(() => subject.playCard()).toThrowError(PlayerErrors.outOfCards);
  });

  test('Should expose the number of cards it has in hand.', () => {
    const subject = new Player('Some Player');
    subject.receiveCard({ suit: 1, rank: 1 });
    subject.receiveCard({ suit: 1, rank: 2 });
    expect(subject.getHand().length).toBe(2);
  });

  test('Should return a copy of its hand.', () => {
    const subject = new Player('Player A');
    const expectedCards: Card[] = [
      { suit: 1, rank: 1, owner: subject.name },
      { suit: 1, rank: 2, owner: subject.name }
    ];
    expectedCards.forEach((card: Card) => subject.receiveCard(card));

    const hand = subject.getHand();
    expect(hand).toEqual(expectedCards);

    hand.push({ suit: 9, rank: 9 });

    // The actual hand of the subject should be unafected by changes to the returned array
    expect(subject.getHand()).toEqual(expectedCards);
  });
});
