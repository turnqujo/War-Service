import { Card } from './card';
import { playCardsIntoPool } from './card-actions';
import { findLosingCards, findWinningCards } from './card-sorting';
import { resolveConflict } from './conflict';
import { acceptCards, Player } from './player';
import { TurnRecord, TurnType } from './record';
import { findPlayerByName } from './roster';
import { checkForVictory } from './victory-logic';

export const cardlessPlayersError = 'No players have enough cards to continue.';
export const skirmish = (roster: Player[], seed?: string): TurnRecord => {
  const playedCards: Card[] = playCardsIntoPool([], roster);

  if (playedCards.length === 0) {
    throw cardlessPlayersError;
  }

  const winningCards = findWinningCards(playedCards);
  if (winningCards.length === 1) {
    // Multiple cards were played, but only one winner
    const uncontestedWinner = findPlayerByName(roster, winningCards[0].playedBy);
    acceptCards(playedCards, uncontestedWinner);

    return {
      type: TurnType.skirmish,
      playedCards,
      nameOfWinner: uncontestedWinner.name,
      winnings: playedCards,
      playersAtEndOfTurn: JSON.parse(JSON.stringify(roster)),
      gameCompleted: checkForVictory(roster)
    };
  }

  if (winningCards.length > 1) {
    // Two or more players have tied in the skirmish, so it is now a conflict
    const contenders = winningCards.map((winner: Card) => findPlayerByName(roster, winner.playedBy));
    const conflictOutcome = resolveConflict(winningCards, contenders, seed);

    const losingCards = findLosingCards(playedCards, winningCards);
    const winnings = conflictOutcome.winnings.concat(losingCards);
    acceptCards(winnings, conflictOutcome.winner);

    return {
      type: TurnType.conflict,
      playedCards,
      nameOfWinner: conflictOutcome.winner.name,
      winnings,
      playersAtEndOfTurn: JSON.parse(JSON.stringify(roster)),
      gameCompleted: checkForVictory(roster)
    };
  }
};
