import { CardPool, OwnedCard } from '../../card-pool/card-pool';
import { isValidPositiveInt } from '../../lib/validation';
import { Player } from '../../player/player';
import * as warLogic from './war.logic';

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

    console.log(`Starting a ${numCards}-card game of War with ${numberOfPlayers} players.`);

    const deck = warLogic.createDeck(numberOfSuits, numberOfRanks);
    const players = warLogic.createPlayers(numberOfPlayers);

    warLogic.dealCardsToPlayers(deck, players, numCards / numberOfPlayers);

    this.reportHandSizes(players);

    let playersStillPlaying = players.slice();
    while (playersStillPlaying.length > 1) {
      const faceUpCards = new CardPool();

      let turnEnded = false;

      for (let i = 0; i < playersStillPlaying.length; i++) {
        const currentPlayer = playersStillPlaying[i];

        try {
          faceUpCards.acceptCard(currentPlayer.getName(), currentPlayer.playCard());
        } catch (e) {
          console.log(`${currentPlayer.getName()} has run out of cards!`);
          playersStillPlaying = warLogic.removeLosingPlayerFromPool(playersStillPlaying, currentPlayer);
          turnEnded = true;
          break;
        }
      }

      if (turnEnded) {
        this.reportHandSizes(playersStillPlaying);
        continue;
      }
    }

    console.log(`${playersStillPlaying[0].getName()} has won!`);
  }

  private readonly reportHandSizes = (players: Player[]): void =>
    console.log(
      `Hand sizes:\n${players.map((player: Player) => `${player.getName()}:\t${player.getHandSize()}`).join('\n')}`
    );
}
