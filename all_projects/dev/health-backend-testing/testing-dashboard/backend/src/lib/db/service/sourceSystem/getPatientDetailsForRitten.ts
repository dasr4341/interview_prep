import { EnvironmentList } from '../../../../config/config.enum';
import { getRemoteData } from '../../dbInstance';

export const getPatientDetailsForRitten = async (facilityId: string, dbInstance: EnvironmentList) => {
  const queryText = `
  SELECT
  u.id,
  p.source_system_patient_id,
  u.first_name,
  u.middle_name,
  u.last_name,
  u.email,
  p.gender,
  p.dob,
  p.discharge_date,
  p.anticipated_discharge_date,
  p.mr_number,
  p.admission_date as intake_date,
  p.level_of_care,
  p.in_patient,
  p.diagnosis_details as diagnosis_codes,
  pct.care_team_details_id
  
  FROM users_on_facilities as a
  INNER JOIN users as u on a.user_id = u.id 
  INNER JOIN patient_details as p on p.patient_id = a.user_id
  INNER JOIN patient_care_teams as pct on pct.patient_details_id = p.id
  WHERE a.facility_id=$1 and user_type = 'PATIENT' 
  `;

  try {
    const query = {
      text: queryText,
      values: [facilityId],
    };

    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
