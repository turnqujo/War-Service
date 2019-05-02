import * as ws from 'ws';
import { createGame } from '../create-game';
import { validateWarOptions } from '../options-validation';
import { TurnRecord } from '../record';
import { skirmish } from '../skirmish';
import { StreamGameMessage } from './socket-payload';

export const streamGame = (socket: ws, data: StreamGameMessage) => {
  const error = validateWarOptions(data.suits, data.ranks, data.players);
  if (error !== null) {
    return socket.send(error);
  }

  const gameRecord = createGame(data.suits, data.ranks, data.players, data.seed);
  socket.send(JSON.stringify({ gameRecord }));

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