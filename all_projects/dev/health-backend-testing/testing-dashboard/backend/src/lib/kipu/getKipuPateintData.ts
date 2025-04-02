import { config } from '../../config/config';
import { KipuDataInterface } from './interface/kipu.interface';
import Kipu from './kipu.lib';

const transformData = (allPatientData: any, careTeam: any) => {
  const careTeamTransformedObj = careTeam?.reduce((prevObj: any, currentObj: any) => {
    const obj: { [key: string]: { [key: string]: string } } = {};

    const careTeamObj = Object.entries(currentObj?.patient_care_team)
      ?.filter((value, index) => {
        if (!(index % 2)) {
          return value;
        }
      })
      .reduce((prevData: any, care: any) => {
        const obj: { [key: string]: string } = {};
        const [key, value] = care;
        obj[key] = value;
        return { ...prevData, ...obj };
      }, {});

    obj[currentObj?.casefile_id] = careTeamObj;

    return { ...prevObj, ...obj };
  }, {});

  const obj = allPatientData?.map((patient: any) => {
    const {
      patient_statuses,
      pre_admission_status,
      program,
      last_updated_at,
      pre_admission_status_id,
      preferred_name,
      alternate_phone,
      sobriety_date,
      ssn,
      address_street2,
      first_contact_date,
      first_contact_information,
      first_contact_relationship,
      first_contact_rep_on_call,
      external_apps,
      ext_id_mappings,
      record_source,
      pronouns,
      alternate_addresses,
      patient_tags,
      insurances,
      ...otherData
    } = patient;

    const formattedInsurances = insurances?.reduce((prevState: any, currentState: any, currentIndex: number) => {
      const obj: { [key: string]: string } = {};
      obj['insurances' + currentIndex + 1] = currentState?.insurance_company || 'N/A';
      return { ...prevState, ...obj };
    }, {});

    return {
      ...otherData,
      ...formattedInsurances,
      ...careTeamTransformedObj[patient?.casefile_id],
    };
  });

  return { ...obj } as KipuDataInterface[];
};

function removeDuplicatePatientData(data: KipuDataInterface[]) {
  return Object.values(data.reduce((prevData: { [key: string]: KipuDataInterface }, currentData) => {
    
    const caseFileId = currentData?.casefile_id;
    const uid = caseFileId ? caseFileId.slice(caseFileId?.indexOf(':') + 1) : caseFileId;
    const patientId = caseFileId ? caseFileId.slice(0, caseFileId?.indexOf(':')) : caseFileId;
  
    if (prevData[uid]) {
      const oldCaseFileId = prevData[uid]?.casefile_id;
      const oldPatientId = oldCaseFileId ? oldCaseFileId.slice(0, oldCaseFileId?.indexOf(':')) : oldCaseFileId;
      if (oldPatientId < patientId) {
        prevData[uid] = currentData;
      }
    } else {
      prevData[uid] = currentData;
    }

    return prevData;
  }, {}))
}

export const getKipuPatientData = async (appId: string, secretKey: string, accessId: string, dateRange: { startDate: string; endDate: string }) => {
  const kipu = new Kipu(appId, secretKey, accessId);

  const result = await kipu.get(`${config.kipu.patientUrl}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`);
  const resultCareTeam = await kipu.get(`${config.kipu.patientCareTeamUrl}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`);
  const transformedData = Object.values(transformData(result.patients, resultCareTeam.patients));
   
  return removeDuplicatePatientData(transformedData);
};
