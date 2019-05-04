import { startApiServer } from './routes';
import { startSocketServer } from './sockets';

startApiServer(3001);
startSocketServer(3002);
