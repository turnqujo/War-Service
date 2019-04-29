import { Card } from "../../common/card/card";
import { ConflictOutcome } from "./conflict-outcome";

export interface HandLookup {
  [playerName: string]: Card[];
}

export interface TurnOutcome {
  playedCards: Card[];
  resolution: ConflictOutcome;
  handsAtStartOfTurn: HandLookup;
  handsAtEndOfTurn: HandLookup;
}
