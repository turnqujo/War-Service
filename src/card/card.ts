import { isValidPositiveInt } from "../lib/validation";

export interface ICard {
  getSuit: () => number;
  getRank: () => number;
  getValue: () => number;
}

export class Card implements ICard {
  private readonly value: number;

  constructor(private readonly suit: number, private readonly rank: number) {
    if (!isValidPositiveInt(suit)) {
      throw "Suit input is invalid.";
    }

    if (!isValidPositiveInt(rank)) {
      throw "Rank input is invalid.";
    }

    this.value = suit * rank;
  }

  public getSuit = (): number => this.suit;
  public getRank = (): number => this.rank;
  public getValue = (): number => this.value;
}
