import { Request, Response } from 'express';
import { createGame } from '../create-game';
import { validateWarConfiguration, isWarConfiguration } from '../validation/war-options';

export const handlePostNewGame = (request: Request, response: Response) => {
  if (!isWarConfiguration(request.body)) {
    return response.status(500).send({ error: 'Body is not of the expected type.' });
  }

  const suits = request.body.suits;
  const ranks = request.body.ranks;
  const players = request.body.players;
  const seed = request.body.seed;
  const error = validateWarConfiguration(suits, ranks, players);
  return error !== null
    ? response.status(500).send({ error })
    : response.status(200).send(createGame(suits, ranks, players, seed));
};
