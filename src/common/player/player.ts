import { Card } from '../card/card';

export interface Player {
  readonly name: string;
  readonly hand: Card[];
}

export const acceptCard = (card: Card, player: Player): void => {
  card.owner ? player.hand.push(card) : player.hand.push({ ...card, owner: player.name });
};

export const acceptCards = (cards: Card[], player: Player): void =>
  cards.forEach((card: Card) => acceptCard(card, player));

export const playCard = (player: Player): Card =>
  player.hand.length > 0 ? { ...player.hand.shift(), playedBy: player.name } : null;
