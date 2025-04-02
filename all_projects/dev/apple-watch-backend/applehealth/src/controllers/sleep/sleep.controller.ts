import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import messagesData from '../../lib/message.lib.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ExceptionType } from '../../enums/exception.enum.js';
import { dbLib } from '../../lib/db.lib.js';
import Exception from '../../lib/exception.lib.js';
import { responseLib } from '../../lib/response.lib.js';
import { validationLib } from '../../lib/validation.lib.js';
import { sleepModelGenerator } from '../../models/activities-model/sleep.model.js';

export class SleepController {
  async sleepDate(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { date } = req.params;

      await validationLib.isValidDate(date);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${date}`, timeZone);
      const endUtcDate = addDays(startUtcDate, 1);

      const sleepModel = await sleepModelGenerator(userId);

      const response = await sleepModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lte: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d' } },
            value: 1,
          },
        },
      ]);

      return responseLib.success(
        res,
        201,
        messagesData.successList.dataRetrieved,
        response
      );
    } catch (error) {
      next(error);
    }
  }

  async sleepDateRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { startDate, endDate } = req.params;

      await validationLib.isValidDateRange(startDate, endDate);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${startDate}`, timeZone);
      const endUtcDate = addDays(zonedTimeToUtc(`${endDate}`, timeZone), 1);

      const sleepModel = await sleepModelGenerator(userId);

      const response = await sleepModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lt: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d' } },
            value: 1,
          },
        },
      ]);

      // return responseLib.success(res, 201, 'sleep data get success', response);
      return responseLib.success(
        res,
        201,
        messagesData.successList.dataRetrieved,
        response
      );
    } catch (error) {
      next(error);
    }
  }
}
