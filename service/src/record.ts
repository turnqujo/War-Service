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
