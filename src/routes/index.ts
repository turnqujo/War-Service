import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { handlePostNewGame } from './new-game';
import { handlePostTakeTurns } from './take-turns';

const warRouter = express.Router();
warRouter.post('/', handlePostNewGame);
warRouter.post('/next', handlePostTakeTurns);
export default warRouter;

export const startApiServer = (port: number) =>
  express()
    .use(cors())
    .use(bodyParser.json())
    .use('/api', warRouter)
    .listen(port, () => console.log(`Listening on port ${port}.`));
