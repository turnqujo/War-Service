import { Deck } from './deck';
import { Card } from '../card/card';

describe('The War Card Deck', () => {
  it('Should at least exist.', () => {
    const subject = new Deck();
    expect(subject).toBeTruthy();
  });

  it('Should create a deck of at least a given size and no larger.', () => {
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

  it('Should shuffle the deck.', () => {
    const subject = new Deck();
    subject.create(4, 13);
    const dealtDeck = Array(4 * 13)
      .fill(null)
      .map((_: null) => subject.deal().getRank());

    subject.create(4, 13);
    subject.shuffle();
    const shuffledDeck = Array(4 * 13)
      .fill(null)
      .map((_: null) => subject.deal().getRank());

    // NOTE: There's a very rare case where the deck will be shuffled,
    // but end up in the same order as it was originally. This has an extremely low chance with
    // a standard deck of cards or larger.
    expect(dealtDeck).not.toEqual(shuffledDeck);
  });

  it('Should clear an existing deck before creating a new one', () => {
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
