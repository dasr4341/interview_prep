import { NextFunction, Request, Response } from 'express';
import { activePatientCount } from '../../../lib/db/service/users/activePatientCount';
import { EnvironmentList } from '../../../config/config.enum';

export const activePatientCountController = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const userResponse = await activePatientCount(req.body, dbInstance);

    const responseData: any = {
      message: 'active patient response data',
      payload: req.body,
      userResponse: {
        rowsCount: userResponse?.rowCount,
      },
    };

    res.json(responseData);
  } catch (e) {
    next(e);
  }
};
