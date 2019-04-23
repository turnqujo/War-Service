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

  public getSuit(): number {
    return this.suit;
  }

  public getRank(): number {
    return this.rank;
  }

  public getValue(): number {
    return this.value;
  }
}
