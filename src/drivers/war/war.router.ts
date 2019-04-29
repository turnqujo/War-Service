import { Router, Request, Response } from 'express';
import { isValidPositiveInt } from '../../lib/validation';
import { War } from './war';

const warRouter = Router();

export enum WarRouterGetGameErrors {
  invalidSuitCount = 'Number of suits must be a positive integer.',
  invalidRankCount = 'Number of ranks must be a positive integer.',
  invalidPlayerCount = 'Number of players must be a positive integer.',
  cannotSplitDeckEvenly = 'Cannot split deck of size (suits * ranks) evenly across the desired number of players.'
}
warRouter.get('/', (request: Request, response: Response) => {
  const desiredSuits = +request.query.suits;
  if (!isValidPositiveInt(desiredSuits)) {
    return response.status(500).send({ error: WarRouterGetGameErrors.invalidSuitCount });
  }

  const desiredRanks = +request.query.ranks;
  if (!isValidPositiveInt(desiredRanks)) {
    return response.status(500).send({ error: WarRouterGetGameErrors.invalidRankCount });
  }

  const desiredPlayers = +request.query.players;
  if (!isValidPositiveInt(desiredPlayers)) {
    return response.status(500).send({ error: WarRouterGetGameErrors.invalidPlayerCount });
  }

  if (desiredSuits * desiredRanks % desiredPlayers !== 0) {
    return response.status(500).send({ error: WarRouterGetGameErrors.cannotSplitDeckEvenly });
  }

  const war = new War();
  try {
    war.play(desiredSuits, desiredRanks, desiredPlayers);
  } catch (error) {
    return response.status(400).send(error);
  }

  response.status(200).send();
});

export default warRouter;
