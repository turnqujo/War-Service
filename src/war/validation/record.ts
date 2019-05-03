import { GameRecord, TurnRecord } from '../record';

export const isGameRecord = (object: any): object is GameRecord =>
  'numberOfRanks' in object && 'numberOfSuits' in object && 'turnRecords' in object;

export const isTurnRecord = (object: any): object is TurnRecord =>
  'gameCompleted' in object &&
  'nameOfWinner' in object &&
  'playedCards' in object &&
  'playersAtEndOfTurn' in object &&
  'type' in object &&
  'winnings' in object;
