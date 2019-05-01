import { Card } from '../../common/card/card';
import { Player } from '../../common/player/player';

export interface GameRecord {
  numberOfRanks: number;
  numberOfSuits: number;
  seed?: string;
  turnRecords: TurnRecord[];
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

export const isTurnRecord = (object: any): object is TurnRecord =>
  'gameCompleted' in object &&
  'nameOfWinner' in object &&
  'playedCards' in object &&
  'playersAtEndOfTurn' in object &&
  'type' in object &&
  'winnings' in object;
