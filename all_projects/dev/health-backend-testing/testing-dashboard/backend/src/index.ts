import dotenv from 'dotenv';
dotenv.config();
import { server } from './lib/app';
import routes from './routes';
import { Exception } from './exception/Exception';
import { StatusCodes } from 'http-status-codes';
import { responseLib } from './lib/response.lib';
import { Request, NextFunction, Response } from 'express';
import { messageData } from './config/messageData';
import defaultMiddleWare from './middleWare/default';

server.use('/api', defaultMiddleWare, routes());
server.use((req: Request, res: Response, next: NextFunction) => next(new Exception(messageData.pageNotFound, {}, StatusCodes.NOT_FOUND)));

server.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Exception) {
    responseLib.error(res, error);
  }
  responseLib.error(res, new Exception(error.message, { error }, StatusCodes.INTERNAL_SERVER_ERROR));
});
