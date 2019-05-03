import { dealCardsToPlayers } from './card-actions';
import { createDeck, shuffle } from './deck';
import { GameRecord, TurnType } from './record';
import { createRoster } from './roster';
import { validateWarConfiguration } from './validation/war-options';

export const createGame = (suits: number, ranks: number, playerCount: number, seed?: string): GameRecord => {
  const error = validateWarConfiguration(suits, ranks, playerCount);
  if (error !== null) {
    throw error;
  }

  const roster = createRoster(playerCount);
  const numCardsPerPlayer = (suits * ranks) / playerCount;
  dealCardsToPlayers(shuffle(createDeck(suits, ranks), seed), roster, numCardsPerPlayer);

  return {
    numberOfSuits: suits,
    numberOfRanks: ranks,
    turnRecords: [
      {
        gameCompleted: false,
        nameOfWinner: null,
        playedCards: [],
        playersAtEndOfTurn: JSON.parse(JSON.stringify(roster)),
        type: TurnType.preparation,
        winnings: []
      }
    ],
    seed
  };
};
