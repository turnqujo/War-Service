import { dealCardsToPlayers } from '../../common/card/card-actions';
import { createDeck, shuffle } from '../../common/deck/deck';
import { Player } from '../../common/player/player';
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
    participantNames: roster.map((player: Player) => player.name),
    turnRecords: [
      {
        type: TurnType.preparation,
        playedCards: [],
        nameOfWinner: null,
        winnings: [],
        playersAtEndOfTurn: JSON.parse(JSON.stringify(roster))
      }
    ],
    nameOfWinner: null,
    seed
  };
};
