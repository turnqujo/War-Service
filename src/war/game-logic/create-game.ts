import { dealCardsToPlayers } from '../../common/card/card-actions';
import { createDeck, shuffle } from '../../common/deck/deck';
import { createRoster } from '../../common/player/roster';
import { GameRecord, TurnType } from '../record/record';
import { validateWarOptions } from '../validation/options-validation';

export const createGame = (
  numberOfSuits: number,
  numberOfRanks: number,
  playerCount: number,
  seed?: string
): GameRecord => {
  const error = validateWarOptions(numberOfSuits, numberOfRanks, playerCount);
  if (error !== null) {
    throw error;
  }

  const roster = createRoster(playerCount);
  const numCardsPerPlayer = (numberOfSuits * numberOfRanks) / playerCount;
  dealCardsToPlayers(shuffle(createDeck(numberOfSuits, numberOfRanks), seed), roster, numCardsPerPlayer);

  return {
    numberOfSuits,
    numberOfRanks,
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
