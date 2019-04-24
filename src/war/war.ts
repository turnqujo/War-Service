import { isValidPositiveInt } from "../lib/validation";
import { Deck } from "../deck/deck";

export interface IWar {
  play: (
    numberOfSuits: number,
    numberOfRanks: number,
    numberOfPlayers: number
  ) => void;
}

export enum WarErrors {
  invalidNumSuits = "Invalid number of suits. Must be a positive integer.",
  invalidNumRanks = "Invalid number of ranks. Must be a positive integer.",
  invalidNumPlayers = "Invalid number of players. Must be a positive integer.",
  cannotSplitEvenly = "Cannot split the deck evenly between all players."
}

export class War implements IWar {
  public play(
    numberOfSuits: number,
    numberOfRanks: number,
    numberOfPlayers: number
  ) {
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

    const deck = new Deck();
    deck.create(numberOfSuits, numberOfRanks);
  }
}
