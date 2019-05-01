import { Card } from '../../common/card/card';
import { Player } from '../../common/player/player';

export interface GameRecord {
  numberOfSuits: number;
  numberOfRanks: number;
  participantNames: string[];
  turnRecords: TurnRecord[];
  nameOfWinner: string;
  seed?: string;
}

export interface TurnRecord {
  type: TurnType;
  playedCards: Card[];
  nameOfWinner: string;
  winnings: Card[];
  playersAtEndOfTurn: Player[];
}

export enum TurnType {
  preparation = 'preparation',
  skirmish = 'skirmish',
  conflict = 'conflict'
}
