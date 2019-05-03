import { Request, Response } from 'express';
import { isTurnRecord } from '../validation/record';
import { takeTurns } from '../take-turns';
import { isPositiveWholeNumber } from '../validation/validation';

export const handlePostTakeTurns = (request: Request, response: Response) => {
  const turnsToTake = +request.query.turns;
  if (!isPositiveWholeNumber(turnsToTake)) {
    return response.status(500).send({ error: 'Turns to Take must be a positive integer.' });
  }

  if (!isTurnRecord(request.body)) {
    return response.status(500).send({ error: 'Request body must be a valid Turn Record.' });
  }

  return response.status(200).send(takeTurns(request.body, turnsToTake, request.query.seed));
};
