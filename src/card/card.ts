export interface ICard {
  getSuit: () => number;
  getRank: () => number;
}

export class Card implements ICard {
  constructor(private readonly suit: number, private readonly rank: number) {}
  public getSuit = (): number => this.suit;
  public getRank = (): number => this.rank;
}
