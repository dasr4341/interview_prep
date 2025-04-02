import { EnvironmentList } from '../../../../../../config/config.enum';
import { getPatientCareTeamDetailsForRitten } from '../../../../../../lib/db/service/sourceSystem/getPatientCareTeamDetailsForRitten';
import { getPatientDetailsForRitten } from '../../../../../../lib/db/service/sourceSystem/getPatientDetailsForRitten';
import { FormattedPatientDataInterface, RittenCareTeamRawDbResponse, RittenPatientRawDbResponse } from '../interface/ritten.interface';

export async function getPatientDetails(facilityId: string, dbInstance: EnvironmentList) {
  const dbResponse = await getPatientDetailsForRitten(facilityId, dbInstance);
  const patientDataFromDb = dbResponse?.rows as RittenPatientRawDbResponse[];

  const { careTeamDetailsId, sourceSystemPatientId } = patientDataFromDb.reduce(
    (prevState: { careTeamDetailsId: string[]; sourceSystemPatientId: string[] }, currentState) => {
      prevState.careTeamDetailsId.push(currentState.care_team_details_id);
      if (currentState.source_system_patient_id && !prevState.sourceSystemPatientId.includes(currentState.source_system_patient_id)) {
        prevState.sourceSystemPatientId.push(currentState.source_system_patient_id);
      }
      return prevState;
    },
    { careTeamDetailsId: [], sourceSystemPatientId: [] },
  );

  const careTeamDbResponse = await getPatientCareTeamDetailsForRitten(careTeamDetailsId, dbInstance);
  const careTeamData: RittenCareTeamRawDbResponse[] = careTeamDbResponse?.rows || [];

  // patientCareTeams
  const formattedPatientCareTeams = careTeamData.reduce((prevData: { [key: string]: any }, currentData) => {
    const { id, care_team_details_id, ...requiredData } = currentData;
    if (prevData[currentData?.care_team_details_id]) {
      prevData[currentData?.care_team_details_id].push(requiredData);
    } else {
      prevData[currentData?.care_team_details_id] = [requiredData];
    }
    return prevData;
  }, {});

  const formattedPatientDataFromDb = patientDataFromDb.reduce((prevState: { [key: string]: FormattedPatientDataInterface }, currentState) => {
    const { id, care_team_details_id, ...requiredData } = currentState;

    if (!prevState[currentState.source_system_patient_id]) {
      prevState[currentState.source_system_patient_id] = { ...requiredData, patient_care_teams: [] };
    }

    if (formattedPatientCareTeams[currentState.care_team_details_id]) {
      prevState[currentState.source_system_patient_id].patient_care_teams.push(...formattedPatientCareTeams[currentState.care_team_details_id]);
    }

    return prevState;
  }, {});

  return { sourceSystemPatientId, patientDetails: formattedPatientDataFromDb };
}
