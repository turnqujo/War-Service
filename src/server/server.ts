import * as express from 'express';
import warRouter from '../drivers/war/war.router';

export const startServer = (port: number) => {
  const app = express();

  app.get('/', (_request: express.Request, response: express.Response) => response.send('Hello, Express!'));

  app.use('/war', warRouter);

  app.listen(port, () => console.log(`Listening on port ${port}.`));
};
