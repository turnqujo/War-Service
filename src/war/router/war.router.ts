import { Request, Response, Router } from 'express';
import { isPositiveWholeNumber } from '../../common/validation/validation';
import { createGame } from '../game-logic/create-game';
import { takeTurns } from '../game-logic/turn-taking';
import { validateWarOptions } from '../validation/options-validation';
import { playWar } from '../war';
import { isTurnRecord } from '../record/record';

const warRouter = Router();

warRouter.get('/', (request: Request, response: Response) => {
  const suits = +request.query.suits;
  const ranks = +request.query.ranks;
  const players = +request.query.players;

  const error = validateWarOptions(suits, ranks, players);
  return error !== null
    ? response.status(500).send({ error })
    : response.status(200).send(playWar(suits, ranks, players, request.query.seed));
});

warRouter.get('/create-game', (request: Request, response: Response) => {
  const suits = +request.query.suits;
  const ranks = +request.query.ranks;
  const players = +request.query.players;

  const error = validateWarOptions(suits, ranks, players);
  return error !== null
    ? response.status(500).send({ error })
    : response.status(200).send(createGame(suits, ranks, players, request.query.seed));
});

warRouter.post('/next', (request: Request, response: Response) => {
  const turnsToTake = +request.query.turns;

  if (!isPositiveWholeNumber(turnsToTake)) {
    return response.status(500).send({ error: 'Turns to Take must be a positive integer.' });
  }

  if (!isTurnRecord(request.body)) {
    return response.status(500).send({ error: 'Request body must be a valid Turn Record.' });
  }

  return response.status(200).send(takeTurns(request.body, turnsToTake, request.query.seed));
});

export default warRouter;
