import { TurnOutcome } from './turn-outcome';

export interface TurnRecord {
  [turnNumber: number]: TurnOutcome;
}

export interface GameOutcome {
  suits: number;
  ranks: number;
  participants: string[];
  turnRecord: TurnRecord;
  winner: string;
}
