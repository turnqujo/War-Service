import { Card } from './card';
import { Player } from './player';

export interface GameRecord {
  numberOfRanks: number;
  numberOfSuits: number;
  turnRecords: TurnRecord[];
  seed?: string;
}

export interface TurnRecord {
  gameCompleted: boolean;
  nameOfWinner: string;
  playedCards: Card[];
  playersAtEndOfTurn: Player[];
  type: TurnType;
  winnings: Card[];
}

export enum TurnType {
  preparation = 'preparation',
  skirmish = 'skirmish',
  conflict = 'conflict'
}

export const isGameRecord = (object: any): object is GameRecord =>
  'numberOfRanks' in object &&
  'numberOfSuits' in object &&
  'turnRecords' in object;

export const isTurnRecord = (object: any): object is TurnRecord =>
  'gameCompleted' in object &&
  'nameOfWinner' in object &&
  'playedCards' in object &&
  'playersAtEndOfTurn' in object &&
  'type' in object &&
  'winnings' in object;
