import { Card } from '../card/card';

export const createDeck = (numberOfSuits: number, numberOfRanks: number): Card[] => {
  const newDeck = [];

  for (let suit = 1; suit <= numberOfSuits; suit++) {
    for (let rank = 1; rank <= numberOfRanks; rank++) {
      newDeck.push({ suit, rank });
    }
  }

  return newDeck;
};

export const shuffle = (deck: Card[]): Card[] => {
  const shuffled = deck.slice();

  // NOTE: Used the Fisher-Yates Shuffle Algorithm
  // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const roll = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[roll]] = [shuffled[roll], shuffled[i]];
  }

  return shuffled;
};
