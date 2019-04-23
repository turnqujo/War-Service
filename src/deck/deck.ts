import { Card } from "../card/card";

export interface IDeck {
  create: (numberOfSuits: number, numberOfRanks: number) => void;
  shuffle: () => void;
  deal: () => Card;
}

export class Deck implements IDeck {
  private currentDeck: Card[];

  constructor() {
    this.currentDeck = [];
  }

  public create(numberOfSuits: number, numberOfRanks: number): void {
    if (numberOfSuits <= 0 || numberOfRanks <= 0) {
      // TODO: Throw
      return;
    }

    for (let suit = 1; suit <= numberOfSuits; suit++) {
      for (let rank = 1; rank <= numberOfRanks; rank++) {
        this.currentDeck.push(new Card(suit, rank));
      }
    }
  }

  public shuffle() {
    const shuffled = this.currentDeck.slice();

    // NOTE: Used the Fisher-Yates Shuffle Algorithm
    // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
    for (let i = this.currentDeck.length - 1; i > 0; i--) {
      const roll = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[roll]] = [shuffled[roll], shuffled[i]];
    }

    this.currentDeck = shuffled;
  }

  public deal(): Card {
    return this.currentDeck.length > 0 ? this.currentDeck.shift() : null;
  }
}
