import { Card } from '../common/card/card';
import { dealCardsToPlayers, giveCardsToPlayer, playCardsIntoPool } from '../common/card/card-actions';
import { Deck } from '../common/deck/deck';
import { Player } from '../common/player/player';
import { createRoster, findPlayerByName } from '../common/player/roster';
import { findLosingCards, findWinningCards } from './game-logic/card-sorting';
import { resolveWar } from './game-logic/turn-logic';
import { checkForVictory } from './game-logic/victory-logic';
import { GameOutcome } from './reporting/game-outcome';
import { buildHandLookup } from './reporting/reporting';
import { validateWarOptions } from './validation/options-validation';

export enum WarErrors {
  missingCards = 'Missing cards'
}

export const playWar = (suits: number, ranks: number, playerCount: number): GameOutcome => {
  const error = validateWarOptions(suits, ranks, playerCount);
  if (error !== null) {
    throw error;
  }

  const deck = new Deck();
  deck.create(suits, ranks);
  deck.shuffle();

  const roster = createRoster(playerCount);
  const numCards = suits * ranks;

  dealCardsToPlayers(deck, roster, numCards / playerCount);

  const gameOutcome: GameOutcome = {
    suits,
    ranks,
    participants: roster.map((player: Player) => player.name),
    turnRecord: {},
    winner: null
  };

  let turnNumber = 0;
  while (gameOutcome.winner === null) {
    turnNumber++;

    // TODO: consolidate this turn logic with the existing war resolution logic

    gameOutcome.turnRecord[turnNumber] = {
      playedCards: [],
      resolution: null,
      handsAtStartOfTurn: buildHandLookup(roster),
      handsAtEndOfTurn: {}
    };

    const faceUpPool: Card[] = playCardsIntoPool([], roster);
    if (faceUpPool.length === 1) {
      // Only one card was played - that player has won

      const remainingPlayer = findPlayerByName(roster, faceUpPool[0].playedBy);
      giveCardsToPlayer(faceUpPool, remainingPlayer);
      gameOutcome.turnRecord[turnNumber] = {
        ...gameOutcome.turnRecord[turnNumber],
        playedCards: faceUpPool,
        resolution: null,
        handsAtEndOfTurn: buildHandLookup(roster)
      };
      gameOutcome.winner = remainingPlayer.name;
      break;
    }

    const winningCards = findWinningCards(faceUpPool);
    if (winningCards.length === 1) {
      // Multiple cards were played, but only one winner
      const uncontestedWinner = findPlayerByName(roster, winningCards[0].playedBy);
      giveCardsToPlayer(faceUpPool, uncontestedWinner);

      const winningPlayer = checkForVictory(roster);
      if (winningPlayer !== null) {
        gameOutcome.winner = winningPlayer.name;
      }

      gameOutcome.turnRecord[turnNumber] = {
        ...gameOutcome.turnRecord[turnNumber],
        playedCards: faceUpPool,
        resolution: {
          winner: uncontestedWinner.name,
          spoils: faceUpPool
        },
        handsAtEndOfTurn: buildHandLookup(roster)
      };
      continue;
    }

    const contenders = winningCards.map((winner: Card) => findPlayerByName(roster, winner.playedBy));
    const conflictOutcome = resolveWar(winningCards, contenders);

    const warWinner = findPlayerByName(roster, conflictOutcome.winner);
    const losingCards = findLosingCards(faceUpPool, winningCards);
    giveCardsToPlayer(conflictOutcome.spoils.concat(losingCards), warWinner);

    const winningPlayer = checkForVictory(roster);
    if (winningPlayer !== null) {
      gameOutcome.winner = winningPlayer.name;
    }

    gameOutcome.turnRecord[turnNumber] = {
      ...gameOutcome.turnRecord[turnNumber],
      playedCards: faceUpPool,
      resolution: conflictOutcome,
      handsAtEndOfTurn: buildHandLookup(roster)
    };
  }

  const gameWinner = findPlayerByName(roster, gameOutcome.winner);
  if (gameWinner.getHand().length !== numCards) {
    throw WarErrors.missingCards;
  }

  return gameOutcome;
}
