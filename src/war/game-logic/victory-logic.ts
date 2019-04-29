import { Player } from "../../common/player/player";

export const checkForVictory = (roster: Player[]): Player => {
  if (roster.length <= 0) {
    return null;
  }

  if (roster.length === 1) {
    return roster[0];
  }

  const playersWithCardsRemaining = roster.filter((player: Player) => player.getHand().length > 0);
  const onlyOnePlayerLeftWithCards = playersWithCardsRemaining.length === 1;
  if (onlyOnePlayerLeftWithCards) {
    return playersWithCardsRemaining[0];
  }

  return null;
};
