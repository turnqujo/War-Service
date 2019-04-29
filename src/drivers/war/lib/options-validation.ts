import { isValidPositiveInt } from "../../../lib/validation";

export enum WarOptionValidationError {
  invalidSuitCount = 'Number of suits must be a positive integer.',
  invalidRankCount = 'Number of ranks must be a positive integer.',
  invalidPlayerCount = 'Number of players must be a positive integer.',
  cannotSplitDeckEvenly = 'Cannot split deck of size (suits * ranks) evenly across the desired number of players.'
}

export const validateWarOptions = (numberOfSuits: number, numberOfRanks: number, numberOfPlayers: number): WarOptionValidationError => {
  if (!isValidPositiveInt(numberOfSuits)) {
    return WarOptionValidationError.invalidSuitCount;
  }

  if (!isValidPositiveInt(numberOfRanks)) {
    return WarOptionValidationError.invalidRankCount;
  }

  if (!isValidPositiveInt(numberOfPlayers)) {
    return WarOptionValidationError.invalidPlayerCount;
  }

  const numCards = numberOfSuits * numberOfRanks;
  if (numCards % numberOfPlayers !== 0) {
    return WarOptionValidationError.cannotSplitDeckEvenly;
  }

  return null;
}
