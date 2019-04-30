import { Card } from "../../common/card/card";
import { giveCardsToPlayer, playCardsIntoPool } from "../../common/card/card-actions";
import { Player } from "../../common/player/player";
import { findPlayerByName } from "../../common/player/roster";
import { buildHandLookup } from "../reporting/reporting";
import { TurnOutcome } from "../reporting/turn-outcome";
import { findLosingCards, findWinningCards } from "./card-sorting";
import { resolveConflict } from "./conflict";

export const cardlessPlayersError = 'No players have enough cards to continue.';
export const skirmish = (roster: Player[]): TurnOutcome => {
  const handsAtStartOfTurn = buildHandLookup(roster);
  const playedCards: Card[] = playCardsIntoPool([], roster);

  if (playedCards.length === 0) {
    throw cardlessPlayersError;
  }

  const winningCards = findWinningCards(playedCards);
  if (winningCards.length === 1) {
    // Multiple cards were played, but only one winner
    const uncontestedWinner = findPlayerByName(roster, winningCards[0].playedBy);
    giveCardsToPlayer(playedCards, uncontestedWinner);

    const resolution = { winner: uncontestedWinner.name, winnings: playedCards };
    return { playedCards, resolution, handsAtStartOfTurn, handsAtEndOfTurn: buildHandLookup(roster) };
  }

  if (winningCards.length > 1) {
    // Two or more players have tied in the skirmish, so it is now a conflict
    const contenders = winningCards.map((winner: Card) => findPlayerByName(roster, winner.playedBy));
    const conflictOutcome = resolveConflict(winningCards, contenders);

    const losingCards = findLosingCards(playedCards, winningCards);
    const winnings = conflictOutcome.winnings.concat(losingCards);
    giveCardsToPlayer(winnings, conflictOutcome.winner);

    const resolution = { winner: conflictOutcome.winner.name, winnings };
    return { playedCards, resolution, handsAtStartOfTurn, handsAtEndOfTurn: buildHandLookup(roster) };
  }
};
