import * as express from 'express';
import * as supertest from 'supertest';
import { WarOptionValidationError } from '../validation/options-validation';
import warRouter from './war.router';

describe('The router for War', () => {
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
      .get('/?suits=4&ranks=13&players=2')
      .then((response: supertest.Response) => {
        expect(response.status).toBe(200);
      }));
});
