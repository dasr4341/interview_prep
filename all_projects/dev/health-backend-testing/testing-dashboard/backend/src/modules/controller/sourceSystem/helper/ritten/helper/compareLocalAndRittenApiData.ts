import { formatInTimeZone } from 'date-fns-tz';
import { DataSource, PatientDischargeStatus } from '../../../../../../config/config.enum';
import { TableRow } from '../../../interface/tableCompatibledata.interface';
import { FormattedPatientDataInterface } from '../interface/ritten.interface';
import { comparePatientContactListRespectToFirstName } from './comparePatientContactListRespectToFirstName';
import { config } from '../../../../../../config/config';


function getPatientStatus(facilityTimeZone: string, dischargeDate: string | null) {
  const timeAsPerTimeZone = formatInTimeZone(new Date(), facilityTimeZone, config.defaultTimeFormat);
  const currentTime = new Date(timeAsPerTimeZone).getTime();
  const dischargedTime = dischargeDate ?  new Date(dischargeDate).getTime() : currentTime;

  return currentTime > dischargedTime ? PatientDischargeStatus.DISCHARGED : PatientDischargeStatus.IN_PATIENT;
}


export function compareLocalAndRittenApiData(
  local: { [key: string]: FormattedPatientDataInterface },
  rittenApiData: FormattedPatientDataInterface[],
  facilityTimeZone: string,
  patientStatus: {
    discharged: boolean, inPatient: boolean
  }
) {
  const comparedData = rittenApiData.filter(r => {
    if (patientStatus.discharged && patientStatus.inPatient) {
      return r;
    }
    const status = getPatientStatus(facilityTimeZone, r?.discharge_date || null);
    if (status === PatientDischargeStatus.DISCHARGED && patientStatus.discharged || (status === PatientDischargeStatus.IN_PATIENT && patientStatus.inPatient)) {
      return r;
    }
  }).reduce((prevData: any, rittenData) => {
    const source_system_patient_id = rittenData?.source_system_patient_id;
    let dbPatientData: any | null = null;
    let isPatientPresent = false;

    if (source_system_patient_id && local[source_system_patient_id]) {
      isPatientPresent = true;
      dbPatientData = local[source_system_patient_id];
    }

    let isErrorExist = false;

    const rittenModifiedData = Object.entries(rittenData).reduce((prevEntries: any, entries) => {
      const [key, actualData] = entries;
      const dbData = dbPatientData ? dbPatientData[key] ?? null : null;

      if (Array.isArray(actualData)) {
        const { modifiedData, isErrorExist: isPatientContactsErrorExist } = comparePatientContactListRespectToFirstName(
          actualData,
          dbData,
          isPatientPresent,
        );

        prevEntries[key] = {
          data: modifiedData,
          isPatientPresent,
          matched: !isPatientContactsErrorExist,
          dbData,
          // needed for excel
          rawRittenData: actualData,
        };
        isErrorExist = true;
      } else if (String(actualData) !== String(dbData)) {
        isErrorExist = true;
      }
      if (!Array.isArray(actualData)) {
        prevEntries[key] = {
          data: actualData,
          isPatientPresent,
          matched: String(actualData) === String(dbData),
          dbData,
          rawRittenData: actualData,
        };
      }

      return prevEntries;
    }, []);


    const patientStatusRitten = getPatientStatus(facilityTimeZone, rittenData?.discharge_date || null );
    const patientStatusRemote = (dbPatientData.in_patient ? PatientDischargeStatus.IN_PATIENT : PatientDischargeStatus.DISCHARGED);

    return [
      ...prevData,
      {
        ...rittenData,
        patient_care_teams: rittenModifiedData.patient_care_teams,
        errors: { ...rittenModifiedData, isErrorExist, isPatientPresent },
        uId: source_system_patient_id,
        source: DataSource.RITTEN,
        patientStatus: patientStatusRitten
      },
      {
        ...dbPatientData,
        uId: source_system_patient_id,
        source: DataSource.LOCAL,
        patientStatus: patientStatusRemote
      },
    ];
  }, []);

  return comparedData as TableRow[];
}
