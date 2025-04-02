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
import { heartModelGenerator } from '../../models/activities-model/heart.model.js';

export default class HeartController {
  async heartDate(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { date } = req.params;
      const { userId } = req.user;

      await validationLib.isValidDate(date);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${date}`, timeZone);
      const endUtcDate = addDays(startUtcDate, 1);

      const heartModel = await heartModelGenerator(userId);

      const response = await heartModel.aggregate([
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
        { $project: { _id: 0, time: '$_id', value: { $round: ['$value', 0] } } },
      ]);

      

      return responseLib.success(
        res,
        StatusCodes.OK,
        messagesData.successList.dataRetrieved,
        response
      );
    } catch (error) {
      next(error);
    }
  }

  async heartDateRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.params;
      const { userId } = req.user;

      await validationLib.isValidDateRange(startDate, endDate);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${startDate}`, timeZone);
      const endUtcDate = addDays(zonedTimeToUtc(`${endDate}`, timeZone), 1);

      const heartModel = await heartModelGenerator(userId);

      const response = await heartModel.aggregate([
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
        { $project: { _id: 0, time: '$_id', value: { $round: ['$value', 0] } } },
        { $sort: { time: 1 } },
      ]);

      return responseLib.success(
        res,
        StatusCodes.OK,
        messagesData.successList.dataRetrieved,
        response
      );
    } catch (error) {
      next(error);
    }
  }

  async heartDateTimeRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, startTime, endTime } = req.params;
      const { userId } = req.user;

      await validationLib.isValidDateTimeRange(startDate, endDate, startTime, endTime);

      const user = await dbLib.getUser(userId);

      const { timeZone } = user;

      const startUtcDate = zonedTimeToUtc(`${startDate} ${startTime}`, timeZone);
      const endUtcDate = zonedTimeToUtc(`${endDate} ${endTime}`, timeZone);

      const heartModel = await heartModelGenerator(userId);

      const response = await heartModel.aggregate([
        { $match: { time: { $gte: startUtcDate, $lte: endUtcDate } } },
        { $group: { _id: '$time', value: { $first: '$value' } } },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            time: { $dateToString: { date: '$_id', timezone: timeZone, format: '%Y-%m-%d %H:%M:%S' } },
            value: { $round: ['$value', 0] },
          },
        },
      ]);

      return responseLib.success(
        res,
        StatusCodes.OK,
        messagesData.successList.dataRetrieved,
        response
      );
    } catch (error) {
      next(error);
    }
  }
}
