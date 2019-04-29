import * as supertest from 'supertest';
import * as express from 'express';
import warRouter, { WarRouterGetGameErrors } from './war.router';

describe('The router for War', () => {
  const fakeApp = express();
  fakeApp.use(warRouter);

  it('Should return a bad request when given an invalid suit count.', () =>
    supertest(fakeApp).get('/?suits=invalid-input&ranks=13&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarRouterGetGameErrors.invalidSuitCount });
    }));

  it('Should return a bad request when given an invalid rank count.', () =>
    supertest(fakeApp).get('/?suits=4&ranks=invalid-input&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarRouterGetGameErrors.invalidRankCount });
    }));

  it('Should return a bad request when given an invalid player count.', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=invalid-input').then((response: supertest.Response) => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: WarRouterGetGameErrors.invalidPlayerCount });
    }));

  it('Should return a bad request when the  cannot be split evenly between the desired players.', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=3').then((response: supertest.Response) => {
      expect(response.status).toBe(500);

      expect(response.body).toEqual({ error: WarRouterGetGameErrors.cannotSplitDeckEvenly });
    }));

  it('Should play a game of War', async () =>
    supertest(fakeApp).get('/?suits=4&ranks=13&players=2').then((response: supertest.Response) => {
      expect(response.status).toBe(200);
    }));

  // it('Should return an internal server error if an unexpected error happens', () => {
  //   // TODO: Will be possible when War is made into a simple function.
  //   return supertest(fakeApp).get('/?suits=4&ranks=13&players=2').then((response: supertest.Response) => {
  //     expect(response.status).toBe(200);
  //   });
  // });
});
