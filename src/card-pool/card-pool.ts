import { Card } from '../card/card';

export interface OwnedCard {
  owner: string;
  card: Card;
}

export type findCardsPredicate = (ownedCard: OwnedCard) => boolean;

export interface ICardPool {
  getPoolSize: () => number;
  acceptCard: (owner: string, card: Card) => number;
  emptyPool: () => OwnedCard[];
  findCards: (predicate: findCardsPredicate) => OwnedCard[];
}

export class CardPool implements ICardPool {
  private cardPool: OwnedCard[];

  constructor() {
    this.cardPool = [];
  }

  public readonly getPoolSize = (): number => this.cardPool.length;

  public readonly acceptCard = (owner: string, card: Card): number => this.cardPool.push({ owner, card });

  public readonly emptyPool = (): OwnedCard[] => this.cardPool.splice(0, this.cardPool.length);

  public readonly findCards = (predicate: findCardsPredicate): OwnedCard[] => this.cardPool.slice().filter(predicate);
}
