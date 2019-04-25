import { Deck } from '../../deck/deck';
import { Player } from '../../player/player';
import { IOwnedCard } from '../../card/owned-card';

export const createShuffledDeck = (numberOfSuits: number, numberOfRanks: number): Deck => {
  const deck = new Deck();
  deck.create(numberOfSuits, numberOfRanks);
  deck.shuffle();
  return deck;
};

export const createRoster = (numberOfPlayers: number): Player[] =>
  Array(numberOfPlayers)
    .fill(null)
    .map((_: null, i: number) => new Player(`Player ${i + 1}`));

export const dealCardsToPlayers = (deck: Deck, players: Player[], cardsPerPlayer: number): void =>
  players.forEach((player: Player) => {
    for (let i = 0; i < cardsPerPlayer; i++) {
      player.receiveCard(deck.deal());
    }
  });

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

export interface IWarOutcome {
  winner: Player;
  spoils: IOwnedCard[];
}

export const resolveWar = (playedCards: IOwnedCard[]): IWarOutcome => {
  const contenders = playedCards.map((playedCard: IOwnedCard) => playedCard.owner);
  const prizePool = playCardsIntoPool(playedCards, contenders);
  const faceUpPool = playCardsIntoPool([], contenders);

  if (faceUpPool.length === 0) {
    // Can happen if all of the contenders didn't have enough cards to do battle - just pick one at random
    return {
      winner: contenders[Math.floor(Math.random() * contenders.length)],
      spoils: prizePool
    };
  }

  if (faceUpPool.length === 1) {
    // Only one card was played - that player has won the battle
    console.log(`Winner by exhaustion: ${faceUpPool[0].owner.getName()}`);
    return { winner: faceUpPool[0].owner, spoils: prizePool.concat(faceUpPool) };
  }

  const winningCards = findWinningCards(faceUpPool);
  if (winningCards.length > 1) {
    // Will need another battle
    const eventualWinner = resolveWar(winningCards);

    const losingCards = faceUpPool.filter(
      (losingCard: IOwnedCard) =>
        !winningCards.find((winningCard: IOwnedCard) => winningCard.owner.getName() === losingCard.owner.getName())
    );

    eventualWinner.spoils = eventualWinner.spoils.concat(prizePool).concat(losingCards);
    return eventualWinner;
  }

  console.log(`Winner by combat: ${winningCards[0].owner.getName()}`);
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
