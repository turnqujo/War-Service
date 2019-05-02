import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as supertest from 'supertest';
import warRouter from '.';
import { isGameRecord } from '../record';

describe('POST on /, create a new game using the given options.', () => {
  const fakeApp = express()
    .use(bodyParser.json()).use(warRouter);

  test('Should return a bad request if given invalid options.', () =>
    supertest(fakeApp)
      .post('/')
      .set('Accept', 'application/json')
      .send({ suits: 4, ranks: 'invalid-input', players: 2, seed: 'new game!' })
      .then((response: supertest.Response) => {
        expect(response.status).toBe(500);
        expect(response.body.error).toBeTruthy();
      }));

  test('Should create and return a new game record, using the options provided.', () =>
    supertest(fakeApp)
      .post('/')
      .set('Accept', 'application/json')
      .send({ suits: 4, ranks: 13, players: 2, seed: 'new game!' })
      .then((response: supertest.Response) => {
        expect(response.status).toBe(200);
        expect(isGameRecord(response.body)).toBe(true);
      }));
});
