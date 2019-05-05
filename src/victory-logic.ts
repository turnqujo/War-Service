import { Player } from './player';

export const checkForVictory = (roster: Player[]): boolean =>
  roster.length <= 1 || roster.filter((player: Player) => player.hand.length > 0).length === 1;
