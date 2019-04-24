export interface ICard {
  getSuit: () => number;
  getRank: () => number;
  getValue: () => number;
}

export class Card implements ICard {
  private readonly value: number;

  constructor(private readonly suit: number, private readonly rank: number) {
    this.value = suit * rank;
  }

  public getSuit = (): number => this.suit;
  public getRank = (): number => this.rank;
  public getValue = (): number => this.value;
}
