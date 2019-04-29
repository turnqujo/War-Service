import { Card } from '../../../models/card';
import { Player } from '../../../player/player';
import { WarOutcome } from '../models/war-outcome';

export const findWinningCards = (playedCards: Card[]): Card[] =>
  playedCards
    .sort((left: Card, right: Card) => (left.rank < right.rank ? 1 : -1))
    .reduce((acc: Card[], playedCard: Card, i: number) => {
      if (i === 0) {
        acc.push(playedCard);
        return acc;
      }

      const playedCardIsTied = acc.find((winningCard: Card) => winningCard.rank === playedCard.rank);
      if (!!playedCardIsTied) {
        acc.push(playedCard);
        return acc;
      }

      return acc;
    }, []);

export const awardCardsToPlayer = (prizeCards: Card[], player: Player): void =>
  prizeCards.forEach((prizeCard: Card) => player.receiveCard(prizeCard));

export const playCardsIntoPool = (pool: Card[], players: Player[]): Card[] =>
  pool.concat(players.filter((player: Player) => player.getHandSize() > 0).map((player: Player) => player.playCard()));

export const findLosingCards = (playedCards: Card[], winningCards: Card[]): Card[] =>
  playedCards.filter((loser: Card) => !winningCards.find((winner: Card) => winner.playedBy === loser.playedBy));

export const findPlayerByNameError = 'Could not find player by name';
export const findPlayerByName = (roster: Player[], name: string): Player => {
  const foundPlayer = roster.find((player: Player) => player.name === name);
  if (!foundPlayer) {
    throw findPlayerByNameError;
  }

  return foundPlayer;
}

export const resolveWar = (contestedCards: Card[], contenders: Player[]): WarOutcome => {
  if (contenders.length === 0) {
    throw 'No contenders given';
  }

  const prizePool = playCardsIntoPool(contestedCards, contenders);
  const faceUpPool = playCardsIntoPool([], contenders);

  if (faceUpPool.length === 0) {
    // Can happen if all of the contenders didn't have enough cards to do battle - just pick one at random
    return {
      winner: contenders[Math.floor(Math.random() * contenders.length)],
      spoils: prizePool
    };
  }

  if (faceUpPool.length === 1) {
    // Only one card was played - that player has won
    try {
      const winner = findPlayerByName(contenders, faceUpPool[0].playedBy);
      return { winner, spoils: prizePool.concat(faceUpPool) };
    } catch (_) {
      throw 'Could not find the winner by exhaustion contender by name';
    }
  }

  const winningCards = findWinningCards(faceUpPool);
  if (winningCards.length > 1) {
    let remainingContenders: Player[];
    try {
      remainingContenders = winningCards.map((card: Card) => findPlayerByName(contenders, card.playedBy));
    } catch (_) {
      throw 'Could not find a remaining contender by name';
    }

    const eventualWinner = resolveWar(winningCards, remainingContenders);
    const losingCards = findLosingCards(faceUpPool, winningCards);
    eventualWinner.spoils = eventualWinner.spoils.concat(prizePool).concat(losingCards);
    return eventualWinner;
  }

  try {
    const winner = findPlayerByName(contenders, winningCards[0].playedBy);
    return { winner, spoils: prizePool.concat(faceUpPool) };
  } catch (_) {
    throw 'Could not find battle winner by name';
  }
};

export enum checkForVictoryErrors {
  emptyRoster = 'Cannot find player in empty roster.'
}
export const checkForVictory = (roster: Player[]): Player => {
  if (roster.length <= 0) {
    throw checkForVictoryErrors.emptyRoster;
  }

  if (roster.length === 1) {
    return roster[0];
  }

  const playersWithCardsRemaining = roster.filter((player: Player) => player.getHandSize() > 0);
  const onlyOnePlayerLeftWithCards = playersWithCardsRemaining.length === 1;
  if (onlyOnePlayerLeftWithCards) {
    return playersWithCardsRemaining[0];
  }

  return null;
};
