import * as ws from 'ws';
import { streamGame } from './stream-game';

export const startSocketServer = (port: number) => {
  const webSocketServer = new ws.Server({ port });
  webSocketServer.on('connection', (socket: ws) => {
    console.log('New connection.');
    // TODO: When there's more possible actions, add a switch.
    socket.on('message', (data: ws.Data) => streamGame(socket, JSON.parse(data.toString())));
  });

  console.log(`Websocket server listening on port ${port}.`);
};
