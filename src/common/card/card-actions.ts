import { Deck } from '../deck/deck';
import { Player } from '../player/player';
import { Card } from './card';

export const dealCardsToPlayers = (deck: Deck, players: Player[], cardsPerPlayer: number): void =>
  players.forEach((player: Player) => {
    for (let i = 0; i < cardsPerPlayer; i++) {
      player.takeWithOwnership(deck.deal());
    }
  });

export const giveCardsToPlayer = (cards: Card[], player: Player): void =>
  cards.forEach((card: Card) => player.receiveCard(card));

export const playCardsIntoPool = (pool: Card[], players: Player[]): Card[] =>
  pool.concat(
    players.filter((player: Player) => player.getHand().length > 0).map((player: Player) => player.playCard())
  );
