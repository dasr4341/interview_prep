import { getRemoteData } from '../../dbInstance';
import { ReportTestPayload } from '../../../../interface/report.interface';
import { EnvironmentList } from '../../../../config/config.enum';

export const userQueryForReport = async (payload: ReportTestPayload, dbInstance: EnvironmentList) => {

  try {
    const query = {
      text: `select ulist.first_name, ulist.last_name, ulist.email, ulist.fitbit_token_invalid, ulist.user_type,
      pd.fitbit_user_id, ulist.id, pd.in_patient, pd.discharge_date
      
      from facilities f
      inner join users_on_facilities uf
       on uf.facility_id =  f.id
      inner join users ulist
       on ulist.id = uf.user_id 
      inner join patient_details pd
          on pd.patient_id = uf.user_id
      where f.id = $1
      and (ulist.fitbit_token_invalid = false) OR (pd.apple_token_invalid = false)
      and ulist.active is true
      and fitbit_user_id is not null
      and ulist.created_at  < $2
      and ulist.deleted_at is null
      and pd.fitbit_user_id is not null
      
      `,
      values: [payload.facilityId, `${payload.date} 24:00:00`],
    };
    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
