import { Player } from '../../common/player/player';

export const checkForVictory = (roster: Player[]): Player => {
  if (roster.length === 1) {
    return roster[0];
  }

  const playersWithCardsRemaining = roster.filter((player: Player) => player.hand.length > 0);
  return playersWithCardsRemaining.length === 1 ? playersWithCardsRemaining[0] : null;
};
