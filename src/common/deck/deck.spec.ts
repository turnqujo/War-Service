import { createDeck, shuffle } from './deck';

describe('Deck Actions', () => {
  test('Should create a new deck of cards.', () => expect(createDeck(4, 13).length).toBe(52));

  test('Should shuffle decks of cards without mutation.', () => {
    const unshuffled = createDeck(4, 13);
    const shuffled = shuffle(unshuffled);

    // NOTE: There's a very rare case where the deck will be shuffled,
    // but end up in the same order as it was originally.
    expect(unshuffled).not.toEqual(shuffled);
  });
});
