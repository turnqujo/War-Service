import { Card } from '../card/card';
import { Deck } from './deck';

describe('The War Card Deck', () => {
  test('Should at least exist.', () => {
    const subject = new Deck();
    expect(subject).toBeTruthy();
  });

  test('Should create a deck of the expected size.', () => {
    const subject = new Deck();
    subject.create(4, 13);
    expect(subject.getSize()).toBe(52);
  });

  test('Should throw if asked to deal another card when all the cards in the deck have been dealt.', () => {
    const subject = new Deck();
    subject.create(4, 13);

    const dealtDeck = Array(4 * 13)
      .fill(null)
      .map((_: null) => subject.deal());
    const deckHasEnoughCards = dealtDeck.every((x: Card) => x !== null);

    expect(deckHasEnoughCards).toBe(true);

    // NOTE: The entire deck should have been dealt by now, so dealing another card is impossible
    expect(() => subject.deal()).toThrow();
  });

  test('Should shuffle the deck.', () => {
    const subject = new Deck();
    subject.create(4, 13);
    const dealtDeck = Array(4 * 13)
      .fill(null)
      .map((_: null) => subject.deal().rank);

    subject.create(4, 13);
    subject.shuffle();
    const shuffledDeck = Array(4 * 13)
      .fill(null)
      .map((_: null) => subject.deal().rank);

    // NOTE: There's a very rare case where the deck will be shuffled,
    // but end up in the same order as it was originally.
    expect(dealtDeck).not.toEqual(shuffledDeck);
  });

  test('Should clear an existing deck before creating a new one', () => {
    const subject = new Deck();
    subject.create(4, 5);
    subject.create(4, 5);

    const dealtDeck = Array(4 * 5)
      .fill(null)
      .map((_: null) => subject.deal());
    const deckHasEnoughCards = dealtDeck.every((x: Card) => x !== null);

    expect(deckHasEnoughCards).toBe(true);

    // NOTE: The entire deck should have been dealt by now, so dealing another card is impossible
    expect(() => subject.deal()).toThrow();
  });
});
