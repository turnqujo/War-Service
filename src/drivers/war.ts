import { isValidPositiveInt } from '../lib/validation';
import { Deck } from '../deck/deck';
import { Player } from '../player/player';

export interface IWar {
  play: (numberOfSuits: number, numberOfRanks: number, numberOfPlayers: number) => void;
}

export enum WarErrors {
  invalidNumSuits = 'Invalid number of suits. Must be a positive integer.',
  invalidNumRanks = 'Invalid number of ranks. Must be a positive integer.',
  invalidNumPlayers = 'Invalid number of players. Must be a positive integer.',
  cannotSplitEvenly = 'Cannot split the deck evenly between all players.'
}

export class War implements IWar {
  public play(numberOfSuits: number, numberOfRanks: number, numberOfPlayers: number) {
    if (!isValidPositiveInt(numberOfSuits)) {
      throw WarErrors.invalidNumSuits;
    }

    if (!isValidPositiveInt(numberOfRanks)) {
      throw WarErrors.invalidNumRanks;
    }

    if (!isValidPositiveInt(numberOfPlayers)) {
      throw WarErrors.invalidNumPlayers;
    }

    const numCards = numberOfSuits * numberOfRanks;
    if (numCards % numberOfPlayers !== 0) {
      throw WarErrors.cannotSplitEvenly;
    }

    const deck = this.setUpDeck(numberOfSuits, numberOfRanks);
    const players = this.createPlayers(numberOfPlayers);

    console.log(`Starting a ${numCards}-card game of War with ${numberOfPlayers} players.`);

    this.dealCardsToPlayers(deck, players, numCards / numberOfPlayers);

    this.reportHandSizes(players);
  }

  private setUpDeck(numberOfSuits: number, numberOfRanks: number): Deck {
    const deck = new Deck();
    deck.create(numberOfSuits, numberOfRanks);
    deck.shuffle();
    return deck;
  }

  private readonly createPlayers = (numberOfPlayers: number): Player[] =>
    Array(numberOfPlayers)
      .fill(null)
      .map((_: null, i: number) => new Player(`Player ${i + 1}`));

  private readonly dealCardsToPlayers = (deck: Deck, players: Player[], cardsPerPlayer: number): void =>
    players.forEach((player: Player) => {
      for (let i = 0; i < cardsPerPlayer; i++) {
        player.receiveCard(deck.deal());
      }
    });

  private readonly reportHandSizes = (players: Player[]): void =>
    console.log(
      `Hand sizes:\n${players.map((player: Player) => `${player.getName()}:\t${player.getHandSize()}`).join('\n')}`
    );
}
