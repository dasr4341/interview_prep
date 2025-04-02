import { EnvironmentList } from '../../../../config/config.enum';
import { getRemoteData } from '../../dbInstance';

export const getPatientCareTeamDetailsForRitten = async (careTeamDetailsId: string[], dbInstance: EnvironmentList) => {
  const queryText = `
  SELECT
  u.id,
  ctdt.care_team_details_id,
  ctdt.care_team_types,
  u.email,
  u.first_name,
  u.middle_name,
  u.last_name
    FROM users_on_facilities as a
    INNER JOIN users as u on a.user_id = u.id
  INNER JOIN care_team_details as c on c.user_id = u.id
  INNER JOIN care_team_details_to_care_team_types as ctdt on ctdt.care_team_details_id = c.id
  where ctdt.care_team_types IN ('PRIMARY_THERAPIST' , 'other')
  and a.facility_id='995a1a03-d6af-4680-9ec3-eadc2a4b54f5'
  and ctdt.care_team_details_id IN (${careTeamDetailsId.map((e) => `'${e}'`).join(", ") || ''});
  `;

  try {
    const query = {
      text: queryText,
      values: []
    };

    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
