import express, { ErrorRequestHandler } from 'express';
import http from 'http';
import { connection } from './config/connection.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import routes from './routes/index.js';
import { Exception } from './exception/Exception.js';
import { StatusCodes } from 'http-status-codes';
import { messageData } from './config/message.js';
import { responseLib } from './lib/response.lib.js';
import { config } from './config/config.js';

// READ // ---
// controller <-> service <-> db model
connection();

const app = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api', routes());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => next(new Exception(messageData.pageNotFound, {}, StatusCodes.NOT_FOUND)));

app.use((error: Exception, req: express.Request, res: express.Response, next: express.NextFunction) => {
    responseLib.error(res, error);
});

app.listen(config.port, () => {
    console.log('Server running at 8080');
});