import * as express from 'express';
import warRouter from './war/router/war.router';

express()
  .use('/war', warRouter)
  .listen(3000, () => console.log('Listening on port 3000.'));
