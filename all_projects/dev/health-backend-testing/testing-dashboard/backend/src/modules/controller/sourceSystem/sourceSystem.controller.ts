import { Response, Request, NextFunction } from 'express';
import { responseLib } from '../../../lib/response.lib';
import { StatusCodes } from 'http-status-codes';
import { Exception } from '../../../exception/Exception';
import { messageData } from '../../../config/messageData';
import { getSourceSystemFacilityList } from '../../../lib/db/service/sourceSystem/getSourceSystemFacilityList';
import _ from 'lodash';
import { EnvironmentList, sourceSystemTypesEnum } from '../../../config/config.enum';
import { getRittenSourceSystemData } from './helper/ritten/getRittenSourceSystemData';
import { getKipuSourceSystemData } from './helper/kipu/getKipuSourceSystemData';

export const getSourceSystemFacilityUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;

    const response = await getSourceSystemFacilityList(req.params.sourceSystemType, dbInstance);
   
    responseLib.success(res, {
      status: StatusCodes.ACCEPTED,
      message: messageData.fetchedDataSuccessfully,
      data: response.rows.map((r: { facilityname: string; id: string }) => ({ name: r?.facilityname, id: r?.id })),
    });
  } catch (error) {
    next(error);
  }
};

export const getSourceSystemData = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  try {
    if (!payload?.facilityId) {
      throw new Exception(messageData.invalidData, {}, StatusCodes.BAD_REQUEST);
    }
    const sourceSystemType = req.params?.sourceSystemType;
    if (sourceSystemType === sourceSystemTypesEnum.KIPU) {
      getKipuSourceSystemData(req, res, next);
    } else {
      getRittenSourceSystemData(req, res, next);
    }
  } catch (e) {
    next(e);
  }
};
