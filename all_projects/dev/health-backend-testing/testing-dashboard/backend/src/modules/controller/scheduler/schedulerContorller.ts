import { NextFunction, Request, Response } from 'express';
import { getFacilityById } from '../../../lib/db/service/facilities/getFacilityById';
import { FacilitiesListPayload, facilitiesListPayload } from '../../../lib/db/service/facilities/facilitiesListSchema';
import { formatInTimeZone } from 'date-fns-tz';
import { config } from '../../../config/config';
import { StatusCodes } from 'http-status-codes';
import { addDays } from 'date-fns'
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { getSchedulerTime } from './helper/getSchedulerTime';
import { getSchedularTimeForSplCase } from './helper/getSchedularTimeForSplCase';
import { transFormToTimeSeriesData } from './helper/transFormToTimeSeriesData';
import { getChartCompatibleData } from './helper/getChartCompatibleData';
import { responseLib } from '../../../lib/response.lib';
import { messageData } from '../../../config/messageData';
import { EnvironmentList } from '../../../config/config.enum';

const moment = extendMoment(Moment);


export const schedulerController = async function (req: Request, res: Response, next: NextFunction) {

  const payload: FacilitiesListPayload = req.body || {};

  try {
    facilitiesListPayload.parse(payload);
  } catch (e) {
    next(e);
  }

  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    
    const startDay = payload.date ? new Date(payload.date) : new Date();
    const endDay = addDays(startDay, 1);

    const day = moment.range(startDay, endDay);
    const timeInterval = Array.from(day.by('minutes', { step: 15 }));

    const listOfFacilities = await getFacilityById(dbInstance, payload?.clientId, payload?.facilityId);
    
    const schedulerRows = listOfFacilities.map(f => {

      const timeZone: string = f.time_zone || config.defaultTimeZone;

      const options = {
        currentDate: formatInTimeZone(startDay, timeZone, config.defaultTimeFormat),
        endDate: formatInTimeZone(endDay, timeZone, config.defaultTimeFormat),
        iterator: true
      };

      const row = {
        ...f,
        schedulerData: Object.entries(config.schedulerConfig as { [key: string]: string }).reduce((_prevValue, scheduler) => {
          const key = scheduler[0];
          const value = scheduler[1];

          const obj: { [key: string]: string[] } = {};


          const result: string[] = [];
          (Object.entries(config.schedulerConfigSplCase).forEach(schedulerConfig => {
            const [objKey, { name, trigger }] = schedulerConfig;
            
            if (key === name) {
              trigger.forEach(triggerData => {
                result.push(...getSchedularTimeForSplCase(startDay, timeZone, triggerData))
              })
            }

          }));

          if (result.length) {
            obj[key] = result;
          } else {
            obj[key] = getSchedulerTime({ scheduler: value, timeZone, options });
          }
          
          return { ..._prevValue, ...obj };
        }, {})
      };

      const timeSeriesData = transFormToTimeSeriesData(row.schedulerData);
      const chartCompatibleData = getChartCompatibleData(timeSeriesData, timeInterval as unknown as string[], row.schedulerData);

      return chartCompatibleData;
    });

    responseLib.success(res, {
      status: StatusCodes.OK,
      message: messageData.fetchedDataSuccessfully,
      data: {
        startDay, endDay,
        rowsCount: listOfFacilities?.length,
        chartData: schedulerRows[0],
      },
    });
    
  } catch (e) {
    next(e);
  }
};
