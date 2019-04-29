import { Player } from "./player";

export const createRoster = (numberOfPlayers: number): Player[] =>
  Array(numberOfPlayers)
    .fill(null)
    .map((_: null, i: number) => new Player(`Player ${i + 1}`));

export const findPlayerByName = (roster: Player[], name: string): Player =>
  roster.find((player: Player) => player.name === name) || null;
