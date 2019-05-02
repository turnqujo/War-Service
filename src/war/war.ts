import { createGame } from './create-game';
import { validateWarOptions } from './options-validation';
import { GameRecord } from './record';
import { takeTurnsToCompletion } from './turn-taking';

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
