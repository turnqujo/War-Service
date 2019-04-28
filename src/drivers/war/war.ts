import * as commonActions from '../../lib/common-actions';
import { isValidPositiveInt } from '../../lib/validation';
import { Card } from '../../models/card';
import * as warLogic from './war.logic';

export interface IWar {
  play: (numberOfSuits: number, numberOfRanks: number, numberOfPlayers: number) => void;
}

export enum WarErrors {
  invalidNumSuits = 'Invalid number of suits. Must be a positive integer.',
  invalidNumRanks = 'Invalid number of ranks. Must be a positive integer.',
  invalidNumPlayers = 'Invalid number of players. Must be a positive integer.',
  cannotSplitEvenly = 'Cannot split the deck evenly between all players.',
  missingCards = 'Missing cards',
  missingRemainingPlayer = 'Could not find remaining player by name',
  missingUncontestedWinner = 'Could not find uncontested player by name',
  missingContender = 'Could not find contender by name',
  missingWarWinner = 'Could not find war winner player by name'
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

      const faceUpPool: Card[] = warLogic.playCardsIntoPool([], roster);
      if (faceUpPool.length === 1) {
        // Only one card was played - that player has won

        let remainingPlayer;
        try {
          remainingPlayer = warLogic.findPlayerByName(roster, faceUpPool[0].playedBy);
        } catch (_) {
          throw WarErrors.missingRemainingPlayer;
        }

        warLogic.awardCardsToPlayer(faceUpPool, remainingPlayer);
        winningPlayer = remainingPlayer;
        break;
      }

      const winningCards = warLogic.findWinningCards(faceUpPool);
      if (winningCards.length === 1) {
        // Multiple cards were played, but only one winner
        let uncontestedWinner;
        try {
          uncontestedWinner = warLogic.findPlayerByName(roster, winningCards[0].playedBy);
        } catch (_) {
          throw WarErrors.missingUncontestedWinner;
        }

        warLogic.awardCardsToPlayer(faceUpPool, uncontestedWinner);
        winningPlayer = warLogic.checkForVictory(roster);
        continue;
      }

      const contenders = winningCards.map((winner: Card) => {
        try {
          return warLogic.findPlayerByName(roster, winner.playedBy);
        } catch (_) {
          throw WarErrors.missingContender;
        }
      });

      const warOutcome = warLogic.resolveWar(winningCards, contenders);
      if (!warOutcome.winner) {
        throw WarErrors.missingWarWinner;
      }

      const losingCards = warLogic.findLosingCards(faceUpPool, winningCards);
      warLogic.awardCardsToPlayer(warOutcome.spoils.concat(losingCards), warOutcome.winner);

      winningPlayer = warLogic.checkForVictory(roster);
    }

    if (winningPlayer.getHandSize() !== numCards) {
      throw WarErrors.missingCards;
    }

    console.log(`${winningPlayer.name} has won on turn ${turnNumber}!`);
  }
}
