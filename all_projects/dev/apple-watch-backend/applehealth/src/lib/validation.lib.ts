import { isMatch } from 'date-fns';
import { StatusCodes } from 'http-status-codes';

import { ExceptionType } from '../enums/exception.enum.js';
import Exception from './exception.lib.js';

export const validationLib = {
  isValidDate: async (date: string) => {
    const test = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!test) throw new Exception(`[${date}] is not a valid date`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);

    const match = isMatch(date, 'yyyy-MM-dd');
    if (!match) throw new Exception(`[${date}] is not a valid date`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
  },

  isValidTime: async (time: string) => {
    const test = /^\d{2}:\d{2}$/.test(time);
    if (!test) throw new Exception(`[${time}] is not a valid time`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);

    const match = isMatch(time, 'HH:mm');
    if (!match) throw new Exception(`[${time}] is not a valid time`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
  },

  isValidDateRange: async (startDate: string, endDate: string) => {
    let dates = [];

    const sTest = /^\d{4}-\d{2}-\d{2}$/.test(startDate);
    if (!sTest) dates.push(`startDate: [${startDate}] is invalid`);

    const eTest = /^\d{4}-\d{2}-\d{2}$/.test(endDate);
    if (!eTest) dates.push(`endDate: [${endDate}] is invalid`);

    if (dates.length) {
      throw new Exception(`${dates}`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
    }
    dates = [];

    const sMatch = isMatch(startDate, 'yyyy-MM-dd');
    if (!sMatch) dates.push(`startDate: [${startDate}] is invalid`);

    const eMatch = isMatch(endDate, 'yyyy-MM-dd');
    if (!eMatch) dates.push(`endDate: [${endDate}] is invalid`);

    if (dates.length) {
      throw new Exception(`${dates}`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
    }
  },

  isValidDateTimeRange: async (startDate: string, endDate: string, startTime: string, endTime: string) => {
    let dateTimes = [];

    const sdTest = /^\d{4}-\d{2}-\d{2}$/.test(startDate);
    if (!sdTest) dateTimes.push(`startDate: [${startDate}] is invalid`);

    const edTest = /^\d{4}-\d{2}-\d{2}$/.test(endDate);
    if (!edTest) dateTimes.push(`endDate: [${endDate}] is invalid`);

    const stTest = /^\d{2}:\d{2}$/.test(startTime);
    if (!stTest) dateTimes.push(`startTime: [${startTime}] is invalid`);

    const etTest = /^\d{2}:\d{2}$/.test(endTime);
    if (!etTest) dateTimes.push(`startTime: [${endTime}] is invalid`);

    if (dateTimes.length) {
      throw new Exception(`${dateTimes}`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
    }
    dateTimes = [];

    const sdMatch = isMatch(startDate, 'yyyy-MM-dd');
    if (!sdMatch) dateTimes.push(`startDate: [${startDate}] is invalid`);

    const edMatch = isMatch(endDate, 'yyyy-MM-dd');
    if (!edMatch) dateTimes.push(`endDate: [${endDate}] is invalid`);

    const stMatch = isMatch(startTime, 'HH:mm');
    if (!stMatch) dateTimes.push(`startTime: [${startTime}] is invalid`);

    const etMatch = isMatch(endTime, 'HH:mm');
    if (!etMatch) dateTimes.push(`endTime: [${endTime}] is invalid`);

    if (dateTimes.length) {
      throw new Exception(`${dateTimes}`, StatusCodes.BAD_REQUEST, '', ExceptionType.VALIDATION);
    }
  },
};
