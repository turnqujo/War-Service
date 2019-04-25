import { Deck } from '../deck/deck';
import { Player } from '../player/player';

export const createShuffledDeck = (numberOfSuits: number, numberOfRanks: number): Deck => {
  const deck = new Deck();
  deck.create(numberOfSuits, numberOfRanks);
  deck.shuffle();
  return deck;
};

export const createRoster = (numberOfPlayers: number): Player[] =>
  Array(numberOfPlayers)
    .fill(null)
    .map((_: null, i: number) => new Player(`Player ${i + 1}`));

export const dealCardsToPlayers = (deck: Deck, players: Player[], cardsPerPlayer: number): void =>
  players.forEach((player: Player) => {
    for (let i = 0; i < cardsPerPlayer; i++) {
      player.receiveCard(deck.deal());
    }
  });
