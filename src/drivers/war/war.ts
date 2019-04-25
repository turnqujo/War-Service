import { isValidPositiveInt } from '../../lib/validation';
import { Player } from '../../player/player';
import * as warLogic from './war.logic';
import { IOwnedCard } from '../../card/owned-card';

export interface IWar {
  play: (numberOfSuits: number, numberOfRanks: number, numberOfPlayers: number) => void;
}

export enum WarErrors {
  invalidNumSuits = 'Invalid number of suits. Must be a positive integer.',
  invalidNumRanks = 'Invalid number of ranks. Must be a positive integer.',
  invalidNumPlayers = 'Invalid number of players. Must be a positive integer.',
  cannotSplitEvenly = 'Cannot split the deck evenly between all players.',
  missingCards = 'Missing cards.'
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

    const deck = warLogic.createShuffledDeck(numberOfSuits, numberOfRanks);
    const roster = warLogic.createRoster(numberOfPlayers);

    warLogic.dealCardsToPlayers(deck, roster, numCards / numberOfPlayers);

    let turnNumber = 0;
    let winningPlayer = null;
    while (winningPlayer === null) {
      turnNumber++;
      console.log(this.handSizeMessage(roster, turnNumber));

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

      console.log(this.warDeclarationMessage(winningCards, turnNumber));
      const warOutcome = warLogic.resolveWar(winningCards);

      const losingCards = faceUpPool.filter(
        (losingCard: IOwnedCard) =>
          !winningCards.find((winningCard: IOwnedCard) => winningCard.owner.getName() === losingCard.owner.getName())
      );

      console.log(
        `Didn't Battle: ${losingCards.map((losingCard: IOwnedCard) => losingCard.owner.getName()).join(', ')}`
      );

      warLogic.awardCardsToPlayer(warOutcome.spoils.concat(losingCards), warOutcome.winner);
      winningPlayer = warLogic.findWinningPlayer(roster);

      const cardsInHands = roster
        .map((player: Player) => player.getHandSize())
        .reduce((acc: number, curr: number) => (acc += curr));
      if (cardsInHands !== numCards) {
        console.log(this.handSizeMessage(roster, turnNumber));
        throw WarErrors.missingCards;
      }
    }

    console.log(`${winningPlayer.getName()} has won on turn ${turnNumber}!`);
  }

  private readonly handSizeMessage = (roster: Player[], turnNumber: number): string =>
    `Hand sizes for turn ${turnNumber}:\n${roster
      .map((player: Player) => `${player.getName()}:\t${player.getHandSize()}`)
      .join('\n')}`;

  private readonly warDeclarationMessage = (conflictingCards: IOwnedCard[], turnNumber: number): string =>
    `War declared on turn ${turnNumber}! Combatants:\n${conflictingCards
      .map((ownedCard: IOwnedCard) => `${ownedCard.owner.getName()}`)
      .join('\n')}`;
}
