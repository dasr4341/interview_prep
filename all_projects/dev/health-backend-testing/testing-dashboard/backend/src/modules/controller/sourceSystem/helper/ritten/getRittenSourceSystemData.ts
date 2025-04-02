import { Response, Request, NextFunction } from 'express';
import { Ritten } from '../../../../../lib/ritten/ritten.lib';
import { responseLib } from '../../../../../lib/response.lib';
import { StatusCodes } from 'http-status-codes';
import { getSourceSystemForFacilities } from '../../../../../lib/db/service/sourceSystem/getSourceSystemForFacilities';
import { messageData } from '../../../../../config/messageData';
import { EnvironmentList } from '../../../../../config/config.enum';
import { getRittenCredentials } from './helper/getRittenCredentials';
import { getPatientDetails } from './helper/getPatientDetails';
import { getTableCompatibleData } from './helper/getTableCompatibleData';
import { compareLocalAndRittenApiData } from './helper/compareLocalAndRittenApiData';
import { getFacilityById } from '../../../../../lib/db/service/facilities/getFacilityById';
import { config } from '../../../../../config/config';
import { RittenSourceSystemPayloadSchema, rittenSourceSystemPayload } from '../../schema/sourceSystemPayload.schema';
import { Exception } from '../../../../../exception/Exception';


export const getRittenSourceSystemData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    rittenSourceSystemPayload.parse(req.body);
  } catch (error) {
    next(new Exception(messageData.invalidData, {}, StatusCodes.BAD_REQUEST));
  }

  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const { facilityId,  discharged, inPatient  } : RittenSourceSystemPayloadSchema = req.body;


    const response = await getSourceSystemForFacilities(facilityId, dbInstance);
    const credentials = getRittenCredentials(response?.rows);

    const facilityDetails = (await getFacilityById(dbInstance, facilityId));
    const facilityTimeZone = facilityDetails.length ? facilityDetails[0].time_zone : config.defaultTimeZone;

    const { sourceSystemPatientId, patientDetails } = await getPatientDetails(facilityId, dbInstance);
    
    const rittenResponse =
      (await Ritten(
        credentials.clientId,
        credentials.clientSecret,
        credentials.audience,
        next,
        sourceSystemPatientId,
      )) || [];

    const comparedData = compareLocalAndRittenApiData(patientDetails, rittenResponse, facilityTimeZone, {
      discharged, inPatient
    });
    const tableCompatibleData = getTableCompatibleData(comparedData, rittenResponse);

    responseLib.success(res, {
      status: StatusCodes.ACCEPTED,
      message: messageData.fetchedDataSuccessfully,
      data: { table: tableCompatibleData, comparedData },
    });
  } catch (e) {
    next(e);
  }
};
