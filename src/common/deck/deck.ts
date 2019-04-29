import { Card } from '../card/card';

export enum DeckErrors {
  noCardsLeft = 'No cards left to deal out.'
}

export class Deck {
  private currentDeck: Card[];

  constructor() {
    this.currentDeck = [];
  }

  public getSize = (): number => this.currentDeck.length;

  public create(numberOfSuits: number, numberOfRanks: number): void {
    this.currentDeck = [];
    for (let suit = 1; suit <= numberOfSuits; suit++) {
      for (let rank = 1; rank <= numberOfRanks; rank++) {
        this.currentDeck.push({ suit, rank });
      }
    }
  }

  public shuffle() {
    const shuffled = this.currentDeck.slice();

    // NOTE: Used the Fisher-Yates Shuffle Algorithm
    // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const roll = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[roll]] = [shuffled[roll], shuffled[i]];
    }

    this.currentDeck = shuffled;
  }

  public deal(): Card {
    if (this.currentDeck.length <= 0) {
      throw DeckErrors.noCardsLeft;
    }

    return this.currentDeck.shift();
  }
}
