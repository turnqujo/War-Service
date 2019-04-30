import { Player } from '../player/player';
import { Card } from './card';

export const notEnoughCardsError = 'Not enough cards in the given deck.';
export const dealCardsToPlayers = (deck: Card[], players: Player[], cardsPerPlayer: number): void => {
  if (players.length * cardsPerPlayer > deck.length) {
    throw notEnoughCardsError;
  }

  players.forEach((player: Player) => {
    for (let i = 0; i < cardsPerPlayer; i++) {
      player.takeWithOwnership(deck.shift());
    }
  });
}

export const giveCardsToPlayer = (cards: Card[], player: Player): void =>
  cards.forEach((card: Card) => player.receiveCard(card));

export const playCardsIntoPool = (pool: Card[], players: Player[]): Card[] =>
  pool.concat(
    players.filter((player: Player) => player.getHand().length > 0).map((player: Player) => player.playCard())
  );
