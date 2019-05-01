import { Player } from '../common/player/player';
import { createGame } from './game-logic/create-game';
import { skirmish } from './game-logic/skirmish';
import { checkForVictory } from './game-logic/victory-logic';
import { GameRecord } from './record/record';
import { validateWarOptions } from './validation/options-validation';

export enum WarErrors {
  missingCards = 'Missing cards'
}

export const playWar = (
  numberOfSuits: number,
  numberOfRanks: number,
  playerCount: number,
  seed?: string
): GameRecord => {
  console.time('Game completed in');
  const error = validateWarOptions(numberOfSuits, numberOfRanks, playerCount);
  if (error !== null) {
    throw error;
  }

  const record = createGame(numberOfSuits, numberOfRanks, playerCount, seed);

  let winner: Player = null;
  let turnNumber = 0;
  while (winner === null) {
    turnNumber++;
    const previousTurnRoster = record.turnRecords[turnNumber - 1].playersAtEndOfTurn;
    record.turnRecords[turnNumber] = skirmish(previousTurnRoster, record.seed);
    winner = checkForVictory(previousTurnRoster);
  }

  if (winner.hand.length !== numberOfSuits * numberOfRanks) {
    throw WarErrors.missingCards;
  }

  record.nameOfWinner = winner.name;
  console.timeEnd('Game completed in');
  return record;
};
