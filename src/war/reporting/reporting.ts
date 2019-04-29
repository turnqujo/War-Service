import { Player } from "../../common/player/player";
import { HandLookup } from "./turn-outcome";

export const buildHandLookup = (players: Player[]): HandLookup =>
  players.reduce((acc: HandLookup, curr: Player) => {
    acc[curr.name] = curr.getHand()
    return acc;
  }, {});
