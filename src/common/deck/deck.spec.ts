import { createDeck, shuffle } from './deck';

describe('Deck Actions', () => {
  test('Should create a new deck of cards.', () => expect(createDeck(4, 13).length).toBe(52));

  test('Should shuffle decks of cards.', () => {
    const unshuffled = createDeck(4, 13);
    const shuffled = shuffle(unshuffled, 'Will be shuffled, but the same way every time!');
    expect(unshuffled).not.toEqual(shuffled);
  });
});
