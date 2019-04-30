import { Card } from "../../common/card/card";

export interface HandLookup {
  [playerName: string]: Card[];
}

export interface Resolution {
  winner: string;
  winnings: Card[];
}

export interface TurnOutcome {
  playedCards: Card[];
  resolution: Resolution;
  handsAtStartOfTurn: HandLookup;
  handsAtEndOfTurn: HandLookup;
}
