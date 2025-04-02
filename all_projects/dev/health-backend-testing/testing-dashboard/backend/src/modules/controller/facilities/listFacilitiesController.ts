import { NextFunction, Request, Response } from 'express';
import { getFacilityById } from '../../../lib/db/service/facilities/getFacilityById';
import { FacilitiesListPayload, facilitiesListPayload } from '../../../lib/db/service/facilities/facilitiesListSchema';
import { EnvironmentList } from '../../../config/config.enum';
import { responseLib } from '../../../lib/response.lib';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../../../config/messageData';

export const listFacilitiesController = async function (req: Request, res: Response, next: NextFunction) {
  const payload: FacilitiesListPayload = req.body;

  try {
    facilitiesListPayload.parse(payload);
  } catch (e) {
    next(e);
  }

  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const list = await getFacilityById(dbInstance, payload?.clientId, payload?.facilityId);
    
    responseLib.success(res, {
      status: StatusCodes.OK,
      message: messageData.fetchedDataSuccessfully,
      data: {
        list
      },
    });
  } catch (e) {
    next(e);
  }
};
