import { Router, Request, Response } from 'express';

const warRouter = Router();

warRouter.get('/', (_request: Request, response: Response) => {
  response.send({});
});

export default warRouter;
