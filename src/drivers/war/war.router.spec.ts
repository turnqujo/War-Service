import * as supertest from 'supertest';
import * as express from 'express';
import warRouter from './war.router';
import { WarOptionValidationError } from './lib/options-validation';

describe('The router for War', () => {
  const fakeApp = express();
  fakeApp.use(warRouter);

  it('Should return a bad request when given an invalid suit count.', () =>
    supertest(fakeApp).get('/?suits=invalid-input&ranks=13&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarOptionValidationError.invalidSuitCount });
    }));

  it('Should return a bad request when given an invalid rank count.', () =>
    supertest(fakeApp).get('/?suits=4&ranks=invalid-input&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarOptionValidationError.invalidRankCount });
    }));

  it('Should return a bad request when given an invalid player count.', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=invalid-input').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarOptionValidationError.invalidPlayerCount });
    }));

  it('Should return a bad request when the deck cannot be split evenly between the desired players.', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=3').then((response: supertest.Response) => {
      expect(response.status).toBe(500);

      expect(response.body).toEqual({ error: WarOptionValidationError.cannotSplitDeckEvenly });
    }));

  it('Should play a game of War', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(200);
    }));
});
