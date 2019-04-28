import { Card } from '../models/card';

export enum PlayerErrors {
  alreadyOwned = 'Cannot accept ownership of an already owned card.',
  outOfCards = 'The player has no more cards.'
}

export class Player {
  private hand: Card[];

  constructor(public readonly name: string) {
    this.hand = [];
  }

  public getHandSize = (): number => this.hand.length;

  public takeWithOwnership(card: Card): void {
    if (!!card.owner) {
      throw PlayerErrors.alreadyOwned;
    }

    this.hand.push({ ...card, owner: this.name });
  }

  public receiveCard(card: Card): void {
    this.hand.push(card);
  }

  public playCard(): Card {
    if (this.hand.length <= 0) {
      throw PlayerErrors.outOfCards;
    }

    return { ...this.hand.shift(), playedBy: this.name };
  }
}
