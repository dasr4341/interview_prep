import { Response, Request, NextFunction } from 'express';
import { Exception } from '../exception/Exception';
import { StatusCodes } from 'http-status-codes';
import { sourceSystemTypesEnum } from '../config/config.enum';
import { messageData } from '../config/messageData';

export default (req: Request, res: Response, next: NextFunction) => {
  const sourceSystem = (req.params?.sourceSystemType?.toLowerCase() as string) || null;
  if (sourceSystem && (sourceSystem === sourceSystemTypesEnum.KIPU || sourceSystem === sourceSystemTypesEnum.RITTEN)) {
      next();
    return;
  }
  next(
    new Exception(
      `${messageData.inValidSourceSystemType}. Valid types -> ${Object.values(sourceSystemTypesEnum)} `,
      { sourceSystem },
      StatusCodes.BAD_REQUEST,
    ),
  );
};
