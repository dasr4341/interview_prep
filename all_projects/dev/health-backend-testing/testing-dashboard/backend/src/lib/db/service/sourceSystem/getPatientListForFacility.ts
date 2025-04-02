import { StatusCodes } from 'http-status-codes';
import { EnvironmentList } from '../../../../config/config.enum';
import { messageData } from '../../../../config/messageData';
import { Exception } from '../../../../exception/Exception';
import { IKipuPatientDataFromDb } from '../../../../modules/controller/sourceSystem/helper/kipu/interface/kipu.interface';
import { getRemoteData } from '../../dbInstance';

export const getPatientListForFacility = async (facilityId: string, dbInstance: EnvironmentList) => {
  const queryText = `SELECT
  u.id,
  p.in_patient,
  p.casefile_id,
  u.first_name,
  u.middle_name,
  u.last_name,
  u.email,
  p.gender,
  p.dob,
  p.race,
  p.ethnicity,
  p.address_street,
  p.address_city,
  p.state,
  p.address_zip, 
  p.address_country,
  p.admission_date,
  p.discharge_date,
  p.anticipated_discharge_date,
  p.date_of_death,
  p.cause_of_death,
  p.discharge_or_transition_id,
  p.discharge_or_transition_name,
  p.discharge_type,
  p.discharge_type_code,
  p.first_contact_name,
  p.referrer_name,
  p.mr_number,
  p.payment_method,
  p.payment_method_category,
  p.insurance_company as insurances01,
  p.room as room_name,
  l.location_code as location_id,
  p.gender_identity,
  p.level_of_care,
  p.bed_name,
  p.next_level_of_care,
  p.maiden_name,
  p.phone,
  p.preferred_language,
  p.preferred_contact,
  p.next_level_of_care as next_level_of_care_date,
  p.diagnosis_details as diagnosis_codes,
  b.name as building_name,
  l.location_name,
  p.phone,
  p.created_at,
  ---
  pc.full_name as patient_contacts_full_name,
  pc.relationship as patient_contacts_relationship,
  pc.contact_type as patient_contacts_contact_type,
  pc.phone  as patient_contacts_phone,
  pc.alternative_phone as patient_contacts_alternative_phone,
  pc.address as patient_contacts_address,
  pc.email as patient_contacts_email,
  pc.notes as patient_contacts_notes
  
 
 
  FROM users_on_facilities as a
  INNER JOIN users as u on a.user_id = u.id 
  INNER JOIN patient_details as p on p.patient_id = a.user_id
  LEFT JOIN buildings as b on p.building_id = b.id
  LEFT JOIN locations as l on  p.location_id = l.id
  LEFT JOIN patient_contacts as pc on a.user_id = pc.patient_id
  WHERE a.facility_id=$1 and user_type = 'PATIENT'
  ORDER BY u.id
  `;
  
  try {
    const query = {
      text: queryText,
      values: [facilityId],
    };
    const response = await getRemoteData({ query, dbInstance });
    if (response?.rows) {
      return response.rows as IKipuPatientDataFromDb[]
    }
    throw new Exception(messageData.errorInFetchingDataFromDb('Please try after some time'), { data: response }, StatusCodes.INTERNAL_SERVER_ERROR);
  } catch (e) {
    throw e;
  }
};
