import { isPositiveWholeNumber } from '../../common/validation/validation';
import { TurnRecord } from '../record/record';
import { skirmish } from './skirmish';

export const takeTurns = (initialTurn: TurnRecord, turnsToTake: number, seed?: string): TurnRecord[] => {
  if (!isPositiveWholeNumber(turnsToTake)) {
    throw 'Number of turns to take must be a positive integer.';
  }

  if (initialTurn.gameCompleted) {
    throw 'Game is already completed.';
  }

  const completedTurns: TurnRecord[] = [initialTurn];
  for (let i = 1; i <= turnsToTake; i++) {
    const roster = JSON.parse(JSON.stringify(completedTurns[i - 1].playersAtEndOfTurn));
    const result = skirmish(roster, seed);
    completedTurns.push(result);

    if (result.gameCompleted) {
      return completedTurns;
    }
  }
  return completedTurns;
};

export const takeTurnsToCompletion = (initialTurn: TurnRecord, seed?: string): TurnRecord[] => {
  if (initialTurn.gameCompleted) {
    throw 'Game is already completed.';
  }

  const completedTurns: TurnRecord[] = [initialTurn];
  let gameCompleted = false;
  while (!gameCompleted) {
    const roster = JSON.parse(JSON.stringify(completedTurns[completedTurns.length - 1].playersAtEndOfTurn));
    const result = skirmish(roster, seed);
    completedTurns.push(result);

    if (result.gameCompleted) {
      break;
    }
  }

  return completedTurns;
};
