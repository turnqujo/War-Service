import { Router, Request, Response } from 'express';
import { playWar } from '../war';
import { validateWarOptions } from '../lib/options-validation';

const warRouter = Router();

warRouter.get('/', (request: Request, response: Response) => {
  const suits = +request.query.suits;
  const ranks = +request.query.ranks;
  const players = +request.query.players;

  const error = validateWarOptions(suits, ranks, players);
  if (error !== null) {
    return response.status(500).send({ error });
  }

  try {
    playWar(suits, ranks, players);
  } catch (errorMsg) {
    return response.status(400).send({ error: errorMsg });
  }

  response.status(200).send();
});

export default warRouter;
