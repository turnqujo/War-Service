import { Player } from '../../common/player/player';

export const checkForVictory = (roster: Player[]): Player => {
  if (roster.length === 1) {
    return roster[0];
  }

  const playersWithCardsRemaining = roster.filter((player: Player) => player.getHand().length > 0);
  if (playersWithCardsRemaining.length === 1) {
    return playersWithCardsRemaining[0];
  }

  return null;
};
