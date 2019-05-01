import * as express from 'express';
import * as bodyParser from 'body-parser';
import warRouter from './war/router/war.router';

express()
  .use(bodyParser.json())
  .use('/war', warRouter)
  .listen(3000, () => console.log('Listening on port 3000.'));
