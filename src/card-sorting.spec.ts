import { Card } from './card';
import { findWinningCards } from './card-sorting';

describe('Determining winning cards logic for War', () => {
  test('Should return a winning card out of a set of non-tied cards', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 10 }, { owner: 'Player B', suit: 2, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(playedCards[0]);
  });

  test('Should return multiple winning cards if there is a tie', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 8 }, { owner: 'Player B', suit: 1, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(2);
  });

  test('Should return one winning card, even if there is a lower-value tie', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 10 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0].rank).toBe(10);
  });

  test('Should be able to handle n-way ties', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 8 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(3);
  });

  test('Should handle a one-player situation (they win)', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 1, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
  });

  test('Should return an empty array if given an empty array', () => {
    const playedCards: Card[] = [];

    expect(() => {
      const result = findWinningCards(playedCards);
      expect(result.length).toBe(0);
    }).not.toThrow();
  });
});
