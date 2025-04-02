import { addDays, eachDayOfInterval } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import { dbLib } from '../../lib/db.lib.js';
import { responseLib } from '../../lib/response.lib.js';
import { StatusCodes } from 'http-status-codes';
import messagesData from '../../lib/message.lib.js';
import Exception from '../../lib/exception.lib.js';
import { ExceptionType } from '../../enums/exception.enum.js';
import { zonedTimeToUtc } from 'date-fns-tz';
import { FlightsClimbedModel, flightsClimbedModelGenerator } from '../../models/activities-model/flightsClimbed.model.js';

export default class FlightsClimbedController {
  async flightsClimbedDate(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (!req?.params?.stDate) {
        throw new Exception(messagesData.errorList.heart.improperFields, StatusCodes.BAD_REQUEST, null, ExceptionType.VALIDATION);
      }
      const { stDate } = req.params;
      const { userId } = req.user;

      const { timeZone } = await dbLib.getUser(userId);

      const startUtcDate = zonedTimeToUtc(`${stDate}`, timeZone);
      const endUtcDate = addDays(startUtcDate, 1);

      const flightsClimbedModel = await flightsClimbedModelGenerator(userId);

      const response = await flightsClimbedModel.aggregate([
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


      return responseLib.success(res, StatusCodes.OK, messagesData.successList.dataRetrieved, response);
    } catch (error) {
      next(error);
    }
  }
  async flightsClimbedDateRange(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (!req?.params?.stDate && !req?.params?.enDate) {
        throw new Exception(messagesData.errorList.heart.improperFields, StatusCodes.BAD_REQUEST, null, ExceptionType.VALIDATION);
      }
      const { stDate, enDate } = req.params;
      const { userId } = req.user;

      const { timeZone } = await dbLib.getUser(userId);

      const startUtcDate = zonedTimeToUtc(`${stDate}`, timeZone);
      const endUtcDate = zonedTimeToUtc(`${enDate}`, timeZone);

      const dateRange = eachDayOfInterval({
        start: startUtcDate,
        end: endUtcDate,
      });

      const flightsClimbedModel = await flightsClimbedModelGenerator(userId);
      const response = await flightsClimbedModel.aggregate([
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

      return responseLib.success(res, StatusCodes.OK, messagesData.successList.dataRetrieved, [...response]);
    } catch (error) {
      next(error);
    }
  }
  async flightsClimbedIntraday(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (!req?.params?.stDate && !req?.params?.enDate) {
        throw new Exception(messagesData.errorList.heart.improperFields, StatusCodes.BAD_REQUEST, null, ExceptionType.VALIDATION);
      }
      const { stDate, enDate, stTime, enTime } = req.params;
      const { userId } = req.user;

      const { timeZone } = await dbLib.getUser(userId);

      const startUtcDate = zonedTimeToUtc(`${stDate} ${stTime}`, timeZone);
      const endUtcDate = zonedTimeToUtc(`${enDate} ${enTime}`, timeZone);

      const dateRange = eachDayOfInterval({
        start: startUtcDate,
        end: endUtcDate,
      });

      const flightsClimbedModel = await flightsClimbedModelGenerator(userId);

      const response = await flightsClimbedModel.aggregate([
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
      
      return responseLib.success(res, StatusCodes.OK, messagesData.successList.dataRetrieved, [...response]);
    } catch (error) {
      next(error);
    }
  }
}
