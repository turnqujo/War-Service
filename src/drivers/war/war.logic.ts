import { IOwnedCard } from '../../card/owned-card';
import { Player } from '../../player/player';

export const findWinningCards = (playedCards: IOwnedCard[]): IOwnedCard[] =>
  playedCards
    .sort((left: IOwnedCard, right: IOwnedCard) => (left.card.getRank() < right.card.getRank() ? 1 : -1))
    .reduce((acc: IOwnedCard[], playedCard: IOwnedCard, i: number) => {
      if (i === 0) {
        acc.push(playedCard);
        return acc;
      }

      const playedCardIsTied = acc.find(
        (winningCard: IOwnedCard) => winningCard.card.getRank() === playedCard.card.getRank()
      );

      if (!!playedCardIsTied) {
        acc.push(playedCard);
        return acc;
      }

      return acc;
    }, []);

export const awardCardsToPlayer = (prizeCards: IOwnedCard[], player: Player): void =>
  prizeCards.forEach((prizeCard: IOwnedCard) => player.receiveCard(prizeCard.card));

export const playCardsIntoPool = (pool: IOwnedCard[], players: Player[]): IOwnedCard[] =>
  pool.concat(
    players
      .filter((player: Player) => player.getHandSize() > 0)
      .map((player: Player) => ({ owner: player, card: player.playCard() }))
  );

export const findLosingCards = (playedCards: IOwnedCard[], winningCards: IOwnedCard[]): IOwnedCard[] =>
  playedCards.filter(
    (losingCard: IOwnedCard) =>
      !winningCards.find((winningCard: IOwnedCard) => winningCard.owner.getName() === losingCard.owner.getName())
  );

export interface IWarOutcome {
  winner: Player;
  spoils: IOwnedCard[];
}

export const resolveWar = (contestedCards: IOwnedCard[]): IWarOutcome => {
  const contenders = contestedCards.map((playedCard: IOwnedCard) => playedCard.owner);
  const prizePool = playCardsIntoPool(contestedCards, contenders);
  const faceUpPool = playCardsIntoPool([], contenders);

  if (faceUpPool.length === 0) {
    // Can happen if all of the contenders didn't have enough cards to do battle - just pick one at random
    return {
      winner: contenders[Math.floor(Math.random() * contenders.length)],
      spoils: prizePool
    };
  }

  if (faceUpPool.length === 1) {
    return { winner: faceUpPool[0].owner, spoils: prizePool.concat(faceUpPool) };
  }

  const winningCards = findWinningCards(faceUpPool);
  if (winningCards.length > 1) {
    const eventualWinner = resolveWar(winningCards);
    const losingCards = findLosingCards(faceUpPool, winningCards);
    eventualWinner.spoils = eventualWinner.spoils.concat(prizePool).concat(losingCards);
    return eventualWinner;
  }

  return {
    winner: winningCards[0].owner,
    spoils: prizePool.concat(faceUpPool)
  };
};

export enum findWinningPlayerErrors {
  emptyRoster = 'Cannot find player in empty roster.'
}
export const findWinningPlayer = (roster: Player[]): Player => {
  if (roster.length <= 0) {
    throw findWinningPlayerErrors.emptyRoster;
  }

  if (roster.length === 1) {
    return roster[0];
  }

  const playersWithCardsRemaining = roster.filter((player: Player) => player.getHandSize() > 0);
  const onlyOnePlayerLeftWithCards = playersWithCardsRemaining.length === 1;
  if (onlyOnePlayerLeftWithCards) {
    return playersWithCardsRemaining[0];
  }

  return null;
};
