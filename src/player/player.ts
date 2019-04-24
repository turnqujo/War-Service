import { Card } from '../card/card';

export interface IPlayer {
  getHandSize: () => number;
  getName: () => string;
  receiveCard: (card: Card) => void;
  playCard: () => Card;
}

export enum PlayerErrors {
  outOfCards = 'The player has no more cards.'
}

export class Player implements IPlayer {
  private hand: Card[];

  constructor(private readonly name: string) {
    this.hand = [];
  }

  public getHandSize = () => this.hand.length;
  public getName = () => this.name;

  public receiveCard(card: Card) {
    this.hand.push(card);
  }

  public playCard() {
    if (this.hand.length <= 0) {
      throw PlayerErrors.outOfCards;
    }

    return this.hand.shift();
  }
}
