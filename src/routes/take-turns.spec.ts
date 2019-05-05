import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as supertest from 'supertest';
import warRouter from '.';
import { Player } from '../player';
import { TurnRecord, TurnType } from '../record';
import { isTurnRecord } from '../validation/record';

describe('POST on /next, calculate and return the next turns based off of a given one.', () => {
  const fakeApp = express()
    .use(bodyParser.json())
    .use(warRouter);

  test('Should return a bad request when given an invalid number of turns to advance.', () =>
    supertest(fakeApp)
      .post('/next?turns=invalid-input')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(typeof response.body.error).toBe('string');
      }));

  test('Should return a bad request when given an invalid body', () =>
    supertest(fakeApp)
      .post('/next?turns=4')
      .set('Accept', 'application/json')
      .send({ foo: 'some garbage' })
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(typeof response.body.error).toBe('string');
      }));

  test('Should return a bad request when given an invalid number of turns to advance.', async () => {
    const playerA: Player = {
      name: 'Player A',
      hand: [{ suit: 1, rank: 1, owner: 'Player A' }, { suit: 2, rank: 2, owner: 'Player A' }]
    };

    const playerB: Player = {
      name: 'Player B',
      hand: [
        { suit: 1, rank: 4, owner: 'Player B' },
        { suit: 2, rank: 5, owner: 'Player B' },
        { suit: 3, rank: 6, owner: 'Player B' }
      ]
    };

    const initialTurn: TurnRecord = {
      gameCompleted: false,
      nameOfWinner: null,
      playedCards: [],
      playersAtEndOfTurn: [playerA, playerB],
      type: TurnType.preparation,
      winnings: []
    };

    await supertest(fakeApp)
      .post('/next?turns=10&seed=api')
      .set('Accept', 'application/json')
      .send(initialTurn)
      .then((response: supertest.Response) => {
        expect(response.status).toBe(200);
        expect(response.body.every((record: TurnRecord) => isTurnRecord(record))).toBe(true);
        expect(response.body.length).toBe(3);
      });
  });
});
