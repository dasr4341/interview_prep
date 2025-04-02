import { getPatientListForFacility } from '../../../../../lib/db/service/sourceSystem/getPatientListForFacility';
import { getSourceSystemForFacilities } from '../../../../../lib/db/service/sourceSystem/getSourceSystemForFacilities';
import { getKipuPatientData } from '../../../../../lib/kipu/getKipuPateintData';
import { KipuSourceSystemPayloadSchema, kipuSourceSystemPayload } from '../../schema/sourceSystemPayload.schema';
import { Response, NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../../../../../config/messageData';
import { Exception } from '../../../../../exception/Exception';
import { responseLib } from '../../../../../lib/response.lib';
import { getKipuCredentials } from './helper/getKipuCredentials';
import { getTableCompatibleData } from './helper/getTableCompatibleData';
import { comparedLocalAndRemoteData } from './helper/comparedLocalAndRemoteData';
import { getPatientDetails } from './helper/getPatientDetails';
import { getFacilityById } from '../../../../../lib/db/service/facilities/getFacilityById';
import { config } from '../../../../../config/config';
import { EnvironmentList } from '../../../../../config/config.enum';

export const getKipuSourceSystemData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    kipuSourceSystemPayload.parse(req.body);
  } catch (error) {
    next(new Exception(messageData.invalidData, {}, StatusCodes.BAD_REQUEST));
  }
 
  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const { facilityId, startDate, endDate, discharged, inPatient } = req.body as KipuSourceSystemPayloadSchema;

    const response = await getSourceSystemForFacilities(facilityId, dbInstance);
    const credentials = getKipuCredentials(response.rows);

    const patientDataFromDb = await getPatientListForFacility(facilityId, dbInstance); // data from db
    const formattedPatientDataFromDb = getPatientDetails(patientDataFromDb);

    const facilityDetails = (await getFacilityById(dbInstance, facilityId));
    const facilityTimeZone = facilityDetails.length ? facilityDetails[0].time_zone : config.defaultTimeZone;
    

    // getting kipu data
    const kipuDataFromRemote = await getKipuPatientData(credentials.appId, credentials.secretKey, credentials.accessId, {
      startDate,
      endDate,
    });

    // comparing both data ---
    const comparedData = comparedLocalAndRemoteData(formattedPatientDataFromDb, kipuDataFromRemote, facilityTimeZone, {
      discharged, inPatient
    });

    // -----------
    const tableComparedData = getTableCompatibleData(comparedData, !!kipuDataFromRemote.length ? (kipuDataFromRemote[0]) : null);
    // ------------------------------------------

    // sending response
    responseLib.success(res, {
      status: StatusCodes.ACCEPTED,
      message: messageData.fetchedDataSuccessfully,
      data: {
        comparedData,
        table: tableComparedData,
      }
    });
  } catch (error) {
    next(error);
  }
};
