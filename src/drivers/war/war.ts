import { IOwnedCard } from '../../card/owned-card';
import * as commonActions from '../../lib/common-actions';
import { isValidPositiveInt } from '../../lib/validation';
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

    const deck = commonActions.createShuffledDeck(numberOfSuits, numberOfRanks);
    const roster = commonActions.createRoster(numberOfPlayers);
    commonActions.dealCardsToPlayers(deck, roster, numCards / numberOfPlayers);

    console.log(`Starting a ${numCards}-card game of War with ${numberOfPlayers} players.`);

    let turnNumber = 0;
    let winningPlayer = null;
    while (winningPlayer === null) {
      turnNumber++;

      const faceUpPool: IOwnedCard[] = warLogic.playCardsIntoPool([], roster);
      if (faceUpPool.length === 1) {
        // Only one card was played - that player has won
        warLogic.awardCardsToPlayer(faceUpPool, faceUpPool[0].owner);
        winningPlayer = faceUpPool[0].owner;
        break;
      }

      const winningCards = warLogic.findWinningCards(faceUpPool);
      if (winningCards.length === 1) {
        warLogic.awardCardsToPlayer(faceUpPool, winningCards[0].owner);
        winningPlayer = warLogic.findWinningPlayer(roster);
        continue;
      }

      const warOutcome = warLogic.resolveWar(winningCards);
      const losingCards = warLogic.findLosingCards(faceUpPool, winningCards);
      warLogic.awardCardsToPlayer(warOutcome.spoils.concat(losingCards), warOutcome.winner);
      winningPlayer = warLogic.findWinningPlayer(roster);
    }

    console.log(`${winningPlayer.getName()} has won on turn ${turnNumber}!`);
  }
}
