import { createGame } from '../create-game';
import { validateWarOptions } from '../options-validation';
import { TurnRecord } from '../record';
import { skirmish } from '../skirmish';
import { isStreamGameMessage, StreamGameMessage } from './socket-payload';

export interface StreamedTurnRecord {
  turnNumber: number;
  thisTurn: TurnRecord;
}

export const streamGame = (socket: { send: (data: any) => void }, data: StreamGameMessage) => {
  if (!isStreamGameMessage(data)) {
    return socket.send(JSON.stringify({ error: 'Message is not of the expected type.' }));
  }

  const error = validateWarOptions(data.suits, data.ranks, data.players);
  if (error !== null) {
    return socket.send(JSON.stringify({ error }));
  }

  const gameRecord = createGame(data.suits, data.ranks, data.players, data.seed);
  socket.send(JSON.stringify(gameRecord));

  let lastTurn: TurnRecord = JSON.parse(JSON.stringify(gameRecord.turnRecords[0]));
  let turnNumber = 0;
  while (true) {
    turnNumber++;

    const thisTurn = skirmish(lastTurn.playersAtEndOfTurn, gameRecord.seed);

    socket.send(JSON.stringify({ turnNumber, thisTurn }));

    if (thisTurn.gameCompleted) {
      break;
    }

    lastTurn = thisTurn;
  }
};
