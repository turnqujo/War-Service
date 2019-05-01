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
