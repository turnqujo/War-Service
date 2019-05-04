import * as bodyParser from 'body-parser';
import * as express from 'express';
import { handlePostNewGame } from './new-game';
import { handlePostTakeTurns } from './take-turns';

const warRouter = express.Router();
warRouter.post('/', handlePostNewGame);
warRouter.post('/next', handlePostTakeTurns);

export const startApiServer = (port: number): void => {
  express()
    .use(bodyParser.json())
    .use('/api', warRouter)
    .listen(port, () => console.log(`Listening on port ${port}.`));
};
