import { Player, PlayerErrors } from './player';
import { Card } from '../card/card';

describe('The Player', () => {
  it('Should at least exist.', () => {
    const subject = new Player('Some Player');
    expect(subject).toBeTruthy();
  });

  it('Should accept and return cards in first-in-first-out order.', () => {
    const subject = new Player('Some Player');
    const exampleCards = [new Card(1, 2), new Card(4, 5), new Card(4, 10)];

    exampleCards.forEach((card: Card) => {
      subject.receiveCard(card);
    });

    exampleCards.forEach((card: Card) => {
      expect(subject.playCard()).toEqual(card);
    });
  });

  it('Should throw if asked to play a card with none left', () => {
    const subject = new Player('Some Player');
    subject.receiveCard(new Card(1, 1));
    subject.playCard();
    expect(() => subject.playCard()).toThrowError(PlayerErrors.outOfCards);
  });

  it('Should expose the number of cards it has in hand', () => {
    const subject = new Player('Some Player');
    subject.receiveCard(new Card(1, 1));
    subject.receiveCard(new Card(1, 2));
    expect(subject.getHandSize()).toBe(2);
  });

  it('Should give its name when asked', () => {
    const subject = new Player('Some Player');
    expect(subject.getName()).toBe('Some Player');
  });
});
