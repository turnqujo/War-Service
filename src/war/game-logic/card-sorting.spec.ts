import { findWinningCards } from './card-sorting';
import { Card } from '../../common/card/card';

describe('Determining winning cards logic for War', () => {
  it('Should return a winning card out of a set of non-tied cards', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 10 }, { owner: 'Player B', suit: 2, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(playedCards[0]);
  });

  it('Should return multiple winning cards if there is a tie', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 2, rank: 8 }, { owner: 'Player B', suit: 1, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(2);
  });

  it('Should return one winning card, even if there is a lower-value tie', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 10 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
    expect(result[0].rank).toBe(10);
  });

  it('Should be able to handle n-way ties', () => {
    const playedCards: Card[] = [
      { owner: 'Player A', suit: 1, rank: 8 },
      { owner: 'Player B', suit: 2, rank: 8 },
      { owner: 'Player C', suit: 3, rank: 8 }
    ];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(3);
  });

  it('Should handle a one-player situation (they win)', () => {
    const playedCards: Card[] = [{ owner: 'Player A', suit: 1, rank: 8 }];

    const result = findWinningCards(playedCards);
    expect(result.length).toBe(1);
  });

  it('Should return an empty array if given an empty array', () => {
    const playedCards: Card[] = [];

    expect(() => {
      const result = findWinningCards(playedCards);
      expect(result.length).toBe(0);
    }).not.toThrow();
  });
});