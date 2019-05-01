import * as random from 'seedrandom';
import { Card } from '../../common/card/card';
import { playCardsIntoPool } from '../../common/card/card-actions';
import { Player } from '../../common/player/player';
import { findPlayerByName } from '../../common/player/roster';
import { findLosingCards, findWinningCards } from './card-sorting';

export interface ConflictOutcome {
  winner: Player;
  winnings: Card[];
}

export const noContendersError = 'No contenders given.';
export const resolveConflict = (contestedCards: Card[], contenders: Player[], seed?: string): ConflictOutcome => {
  if (contenders.length === 0) {
    throw noContendersError;
  }

  const prizePool = playCardsIntoPool(contestedCards, contenders);
  const faceUpPool = playCardsIntoPool([], contenders);

  if (faceUpPool.length === 0) {
    // Can happen if all of the contenders didn't have enough cards to do battle - just pick one at random
    const rng = random(seed);
    return {
      winner: contenders[Math.floor(rng.quick() * contenders.length)],
      winnings: prizePool
    };
  }

  if (faceUpPool.length === 1) {
    // Only one card was played - that player has won
    const winner = findPlayerByName(contenders, faceUpPool[0].playedBy);
    return { winner, winnings: prizePool.concat(faceUpPool) };
  }

  const winningCards = findWinningCards(faceUpPool);
  if (winningCards.length > 1) {
    const remainingContenders: Player[] = winningCards.map((card: Card) => findPlayerByName(contenders, card.playedBy));
    const eventualOutcome = resolveConflict(winningCards, remainingContenders);

    const losingCards = findLosingCards(faceUpPool, winningCards);
    eventualOutcome.winnings = eventualOutcome.winnings.concat(prizePool).concat(losingCards);
    return eventualOutcome;
  }

  const winner = findPlayerByName(contenders, winningCards[0].playedBy);
  return { winner, winnings: prizePool.concat(faceUpPool) };
};
