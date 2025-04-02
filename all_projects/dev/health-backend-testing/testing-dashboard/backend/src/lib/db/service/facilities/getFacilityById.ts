import { Request } from 'express';
import { getRemoteData } from '../../dbInstance';
import { FacilitiesListPayload } from './facilitiesListSchema';
import { EnvironmentList } from '../../../../config/config.enum';
import { Facility } from './facilityResponse.interface';
import { Exception } from '../../../../exception/Exception';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../../../../config/messageData';

export const getFacilityById = async (dbInstance : EnvironmentList, clientId?: string, facilityId?: string) => {
  const queryValues: string[] = [];

  let queryText = `
  SELECT
    fa.name,
    fa.id as facilityId,
    fa.time_zone,
    fa.source_system_id,
    ac.id
  FROM
    facilities fa
    INNER JOIN accounts ac ON fa.account_id  = ac.id
  `;

  if (clientId) {
    queryText += `WHERE ac.id = $1`;
    queryValues.push(clientId);
  } 

  if (facilityId) {
    queryText += clientId ? ' AND fa.id = $2' : ' WHERE fa.id = $1';
    queryValues.push(facilityId);
  }

  try {
    const query = {
      text: queryText,
      values: queryValues,
    };
    const facilityResponse = (await getRemoteData({ query, dbInstance }));
    if (facilityResponse?.rows) {
      return facilityResponse.rows  as Facility[]
    } 
    throw new Exception(messageData.errorInFetchingDataFromDb('Please try after some time'), { data: facilityResponse }, StatusCodes.INTERNAL_SERVER_ERROR);
  } catch (e) {
    throw e;
  }
};
