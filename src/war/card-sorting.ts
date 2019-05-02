import { Card } from './card';

export const findWinningCards = (playedCards: Card[]): Card[] =>
  playedCards
    .sort((left: Card, right: Card) => (left.rank < right.rank ? 1 : -1))
    .reduce((acc: Card[], playedCard: Card, i: number) => {
      if (i === 0) {
        acc.push(playedCard);
        return acc;
      }

      const playedCardIsTied = acc.find((winningCard: Card) => winningCard.rank === playedCard.rank);
      if (!!playedCardIsTied) {
        acc.push(playedCard);
        return acc;
      }

      return acc;
    }, []);

export const findLosingCards = (playedCards: Card[], winningCards: Card[]): Card[] =>
  playedCards.filter((loser: Card) => !winningCards.find((winner: Card) => winner.playedBy === loser.playedBy));
