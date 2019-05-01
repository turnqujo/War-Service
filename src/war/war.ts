import { createGame } from './game-logic/create-game';
import { takeTurnsToCompletion } from './game-logic/turn-taking';
import { GameRecord } from './record/record';
import { validateWarOptions } from './validation/options-validation';

export enum WarErrors {
  missingCards = 'Missing cards'
}

export const playWar = (suits: number, ranks: number, playerCount: number, seed?: string): GameRecord => {
  const error = validateWarOptions(suits, ranks, playerCount);
  if (error !== null) {
    throw error;
  }

  const record = createGame(suits, ranks, playerCount, seed);
  record.turnRecords = takeTurnsToCompletion(record.turnRecords[0], seed);
  return record;
};
