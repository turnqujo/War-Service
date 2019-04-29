import { Request, Response, Router } from 'express';
import { validateWarOptions } from '../validation/options-validation';
import { playWar } from '../war';

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
    response.status(200).send(playWar(suits, ranks, players));
  } catch (errorMsg) {
    return response.status(400).send({ error: errorMsg });
  }
});

export default warRouter;
