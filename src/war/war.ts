import { dealCardsToPlayers } from '../common/card/card-actions';
import { createDeck, shuffle } from '../common/deck/deck';
import { Player } from '../common/player/player';
import { createRoster } from '../common/player/roster';
import { skirmish } from './game-logic/skirmish';
import { checkForVictory } from './game-logic/victory-logic';
import { GameOutcome } from './reporting/game-outcome';
import { validateWarOptions } from './validation/options-validation';

export enum WarErrors {
  missingCards = 'Missing cards'
}

export const playWar = (suits: number, ranks: number, playerCount: number): GameOutcome => {
  const error = validateWarOptions(suits, ranks, playerCount);
  if (error !== null) {
    throw error;
  }

  const deck = shuffle(createDeck(suits, ranks));
  const roster = createRoster(playerCount);
  const numCards = suits * ranks;

  dealCardsToPlayers(deck, roster, numCards / playerCount);

  const record: GameOutcome = {
    suits,
    ranks,
    participants: roster.map((player: Player) => player.name),
    turnRecord: {},
    winner: null
  };

  let winner: Player = null;
  let turnNumber = 0;
  while (winner === null) {
    turnNumber++;
    record.turnRecord[turnNumber] = skirmish(roster);
    winner = checkForVictory(roster);
  }

  if (winner.getHand().length !== numCards) {
    throw WarErrors.missingCards;
  }

  record.winner = winner.name;
  return record;
};
