import { NextFunction, Request, Response } from 'express';
import { userQueryForReport } from '../../../lib/db/service/users/userQueryForDailyReport';
import { EnvironmentList } from '../../../config/config.enum';

export const userResponseController = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const userResponse = await userQueryForReport(req.body, dbInstance);

    const responseData: any = {
      message: 'response data',
      payload: req.body,
      userResponse: {
        rowsCount: userResponse?.rowCount,
        rows: userResponse?.rows,
      },
    };

    res.json(responseData);
  } catch (e) {
    next(e);
  }
};
