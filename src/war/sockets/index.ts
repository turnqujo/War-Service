import * as ws from 'ws';
import { isStreamGameMessage } from './socket-payload';
import { streamGame } from './stream-game';

export const startSocketServer = (port: number) => {
  const webSocketServer = new ws.Server({ port });
  webSocketServer.on('connection', (socket: ws) => {
    socket.on('message', (data: ws.Data) => {
      const parsedMessage = JSON.parse(data.toString());
      if (!isStreamGameMessage(parsedMessage)) {
        socket.send('Message is not of the expected type.');
        return;
      }

      streamGame(socket, parsedMessage);
    });
  });

  console.log(`Websocket server listening on port ${port}.`);
};
