import { Card } from '../../common/card/card';
import { playCardsIntoPool } from '../../common/card/card-actions';
import { Player } from '../../common/player/player';
import { findPlayerByName } from '../../common/player/roster';
import { ConflictOutcome } from '../reporting/conflict-outcome';
import { findLosingCards, findWinningCards } from './card-sorting';

export const resolveWar = (contestedCards: Card[], contenders: Player[]): ConflictOutcome => {
  if (contenders.length === 0) {
    throw 'No contenders given';
  }

  const prizePool = playCardsIntoPool(contestedCards, contenders);
  const faceUpPool = playCardsIntoPool([], contenders);

  if (faceUpPool.length === 0) {
    // Can happen if all of the contenders didn't have enough cards to do battle - just pick one at random
    return {
      winner: contenders[Math.floor(Math.random() * contenders.length)].name,
      spoils: prizePool
    };
  }

  if (faceUpPool.length === 1) {
    // Only one card was played - that player has won
    try {
      const winner = findPlayerByName(contenders, faceUpPool[0].playedBy).name;
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
    const winner = findPlayerByName(contenders, winningCards[0].playedBy).name;
    return { winner, spoils: prizePool.concat(faceUpPool) };
  } catch (_) {
    throw 'Could not find battle winner by name';
  }
};
