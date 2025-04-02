import { Response, Request, NextFunction } from 'express';
import { Exception } from '../exception/Exception';
import { StatusCodes } from 'http-status-codes';
import { EnvironmentList } from '../config/config.enum';
import { messageData } from '../config/messageData';
import { merge } from 'lodash';

export default (req: Request, res: Response, next: NextFunction) => {
  const dbInstance = (req.headers['db_instance'] as EnvironmentList) || null;
  if (dbInstance && process.env[`db_user_${dbInstance}`]) {
      merge(req, { dbInstance });
      next();
    return;
  }
  next(
    new Exception(
        messageData.dbInstanceNotFound,
      { dbInstance },
      StatusCodes.BAD_REQUEST,
    )
  );
};
