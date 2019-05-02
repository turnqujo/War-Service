import { Request, Response } from 'express';
import { createGame } from '../create-game';
import { validateWarOptions } from '../options-validation';

export interface NewGameRequestBody {
  suits: number;
  ranks: number;
  players: number;
  seed?: string;
}

export const handlePostNewGame = (request: Request, response: Response) => {
  const suits = request.body.suits;
  const ranks = request.body.ranks;
  const players = request.body.players;
  const seed = request.body.seed;

  const error = validateWarOptions(suits, ranks, players);
  return error !== null
    ? response.status(500).send({ error })
    : response.status(200).send(createGame(suits, ranks, players, seed));
};
