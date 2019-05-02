import { Router } from 'express';
import { handlePostNewGame } from './new-game';
import { handlePostTakeTurns } from './take-turns';

const warRouter = Router();

warRouter.post('/', handlePostNewGame);
warRouter.post('/next', handlePostTakeTurns);

export default warRouter;
