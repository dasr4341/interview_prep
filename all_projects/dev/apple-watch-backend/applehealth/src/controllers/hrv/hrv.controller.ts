import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ExceptionType } from '../../enums/exception.enum.js';
import { dbLib } from '../../lib/db.lib.js';
import Exception from '../../lib/exception.lib.js';
import { responseLib } from '../../lib/response.lib.js';
import { validationLib } from '../../lib/validation.lib.js';
import { hrvModelGenerator } from '../../models/activities-model/hrv.model.js';

export class HrvController {
  async hrvDate(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { date }: any = req.params;
      const { userId } = req.user;

      await validationLib.isValidDate(date);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${date}`, timeZone);
      const endUtcDate = addDays(startUtcDate, 1);

      const hrvModel = await hrvModelGenerator(userId);

      const response = await hrvModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lt: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d' } },
            value: 1,
          },
        },
        { $group: { _id: '$time', value: { $avg: '$value' } } },
        { $project: { _id: 0, time: '$_id', value: { $round: ['$value', 3] } } },
      ]);

      return responseLib.success(res, StatusCodes.OK, 'hrv data get success', response);
    } catch (error) {
      next(error);
    }
  }

  async hrvDateRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate }: any = req.params;
      const { userId } = req.user;

      await validationLib.isValidDateRange(startDate, endDate);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${startDate}`, timeZone);
      const endUtcDate = addDays(zonedTimeToUtc(`${endDate}`, timeZone), 1);

      const hrvModel = await hrvModelGenerator(userId);

      const response = await hrvModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lt: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d' } },
            value: 1,
          },
        },
        { $group: { _id: '$time', value: { $avg: '$value' } } },
        { $project: { _id: 0, time: '$_id', value: { $round: ['$value', 3] } } },
        { $sort: { time: 1 } },
      ]);

      return responseLib.success(res, 201, 'hrv date range get success', response);
    } catch (error) {
      next(error);
    }
  }

  async hrvDateTimeRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { startDate, endDate, startTime, endTime } = req.params;

      await validationLib.isValidDateTimeRange(startDate, endDate, startTime, endTime);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${startDate} ${startTime}`, timeZone);
      const endUtcDate = zonedTimeToUtc(`${endDate} ${endTime}`, timeZone);

      const hrvModel = await hrvModelGenerator(userId);

      const response = await hrvModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lte: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d %H:%M:%S' } },
            value: { $round: ['$value', 3] },
          },
        },
      ]);
      return responseLib.success(res, 201, 'hrv date time range get success', response);
    } catch (error) {
      next(error);
    }
  }
}
