import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as supertest from 'supertest';
import { Player } from '../../common/player/player';
import { GameRecord, TurnRecord, TurnType } from '../record/record';
import { WarOptionValidationError } from '../validation/options-validation';
import warRouter from './war.router';

describe('GET on /, play full game to completion', () => {
  const fakeApp = express().use(warRouter);

  test('Should return a bad request when given an invalid suit count.', () =>
    supertest(fakeApp)
      .get('/?suits=invalid-input&ranks=13&players=2')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidSuitCount });
      }));

  test('Should return a bad request when given an invalid rank count.', () =>
    supertest(fakeApp)
      .get('/?suits=4&ranks=invalid-input&players=2')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidRankCount });
      }));

  test('Should return a bad request when given an invalid player count.', async () =>
    supertest(fakeApp)
      .get('/?suits=4&ranks=13&players=invalid-input')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidPlayerCount });
      }));

  test('Should return a bad request when the deck cannot be split evenly between the desired players.', async () =>
    supertest(fakeApp)
      .get('/?suits=4&ranks=13&players=3')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);

        expect(response.body).toEqual({ error: WarOptionValidationError.cannotSplitDeckEvenly });
      }));

  test('Should play a game of War', async () =>
    supertest(fakeApp)
      .get('/?suits=4&ranks=13&players=2&seed=api')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(200);
      }));
});

describe('GET on /create-game, generate and return a game record object', () => {
  const fakeApp = express().use(warRouter);

  test('Should return a bad request when given an invalid suit count.', () =>
    supertest(fakeApp)
      .get('/create-game?suits=invalid-input&ranks=13&players=2')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidSuitCount });
      }));

  test('Should return a bad request when given an invalid rank count.', () =>
    supertest(fakeApp)
      .get('/create-game?suits=4&ranks=invalid-input&players=2')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidRankCount });
      }));

  test('Should return a bad request when given an invalid player count.', async () =>
    supertest(fakeApp)
      .get('/create-game?suits=4&ranks=13&players=invalid-input')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: WarOptionValidationError.invalidPlayerCount });
      }));

  test('Should return a bad request when the deck cannot be split evenly between the desired players.', async () =>
    supertest(fakeApp)
      .get('/create-game?suits=4&ranks=13&players=3')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);

        expect(response.body).toEqual({ error: WarOptionValidationError.cannotSplitDeckEvenly });
      }));

  test('Should create and return a new game record object.', async () =>
    supertest(fakeApp)
      .get('/create-game?suits=4&ranks=13&players=2&seed=api')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(200);

        const result: GameRecord = response.body;
        expect(result.numberOfSuits).toBe(4);
        expect(result.numberOfRanks).toBe(13);
        expect(result.turnRecords.length).toBe(1);
      }));
});

describe('POST on /next, calculate and return the next turns based off of a given one.', () => {
  const fakeApp = express()
    .use(bodyParser.json())
    .use(warRouter);

  test('Should return a bad request when given an invalid number of turns to advance.', () =>
    supertest(fakeApp)
      .post('/next?turns=invalid-input')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body.error).toBeTruthy();
      }));

  test('Should return a bad request when given an invalid body', () =>
    supertest(fakeApp)
      .post('/next?turns=4')
      .set('Accept', 'application/json')
      .send({ foo: 'some garbage' })
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body.error).toBeTruthy();
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
        const result: TurnRecord[] = response.body;
        expect(result.length).toBe(3);
      });
  });
});
