import * as bodyParser from 'body-parser';
import * as express from 'express';
import warRouter from './war/routes';

express()
  .use(bodyParser.json())
  .use('/war', warRouter)
  .listen(3000, () => console.log('Listening on port 3000.'));
