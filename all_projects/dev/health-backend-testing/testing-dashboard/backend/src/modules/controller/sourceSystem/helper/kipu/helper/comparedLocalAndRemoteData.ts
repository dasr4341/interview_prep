import { formatInTimeZone } from 'date-fns-tz';
import { DataSource, PatientDischargeStatus } from '../../../../../../config/config.enum';
import { KipuDataInterface } from '../../../../../../lib/kipu/interface/kipu.interface';
import { IKipuRowComparedData } from '../interface/kipu.interface';
import { comparePatientContactListRespectToFirstName } from './comparePatientContactListRespectToFirstName';
import { getPatientDetails } from './getPatientDetails';
import { config } from '../../../../../../config/config';

interface IModifiedKipuData {
  data: string | KipuDataInterface[] | null;
  isPatientPresent: boolean;
  matched: boolean;
  dbData: string | null;
  rawKipuData: string | KipuDataInterface[] | null;
}

function getPatientStatus(facilityTimeZone: string, dischargeDate: string) {
  const timeAsPerTimeZone = formatInTimeZone(new Date(), facilityTimeZone, config.defaultTimeFormat);
  const currentTime = new Date(timeAsPerTimeZone).getTime();
  const dischargedTime = new Date(dischargeDate).getTime();
  return currentTime > dischargedTime ? PatientDischargeStatus.DISCHARGED : PatientDischargeStatus.IN_PATIENT;
}

export function comparedLocalAndRemoteData(local: ReturnType<typeof getPatientDetails>, remote: KipuDataInterface[], facilityTimeZone: string,
  patientStatus: {
    discharged: boolean, inPatient: boolean
  }) {
  return remote
    .filter(r => {
      if (patientStatus.discharged && patientStatus.inPatient) {
        return r;
      }
      const status = getPatientStatus(facilityTimeZone, r.discharge_date);
      if (status === PatientDischargeStatus.DISCHARGED && patientStatus.discharged || (status === PatientDischargeStatus.IN_PATIENT && patientStatus.inPatient)) {
        return r;
      }
    })
    .filter((r) => !!local[r.casefile_id])
    .reduce((prevData: any, kipuData) => {
      const caseFileId = kipuData?.casefile_id;
      let dbPatientData: { [key: string]: any } | null = local[caseFileId];
      let isPatientPresent = true;
      let isErrorExist = false;

      const kipuModifiedData = Object.entries(kipuData).reduce((prevEntries: { [key: string]: IModifiedKipuData }, entries) => {
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
            rawKipuData: actualData,
          };
          isErrorExist = true;
        } else if (String(actualData).toLowerCase() !== String(dbData).toLowerCase()) {
          isErrorExist = true;
        }
        if (!Array.isArray(actualData)) {
          prevEntries[key] = {
            data: actualData,
            isPatientPresent,
            matched: String(actualData).toLowerCase() === String(dbData).toLowerCase(),
            dbData,
            rawKipuData: actualData,
          };
        }

        return prevEntries;
      }, {});

      const patientStatusKipu = getPatientStatus(facilityTimeZone, kipuData.discharge_date);
      const patientStatusLocal = dbPatientData?.in_patient ? PatientDischargeStatus.IN_PATIENT : PatientDischargeStatus.DISCHARGED;

      return [
        ...prevData,
        {
          ...kipuData,
          patient_contacts: kipuModifiedData.patient_contacts,
          errors: { ...kipuModifiedData, isErrorExist, isPatientPresent },
          uId: caseFileId,
          source: DataSource.KIPU,
          patientStatus: patientStatusKipu,
        },
        {
          ...dbPatientData,
          uId: caseFileId,
          source: DataSource.LOCAL,
          patientStatus: patientStatusLocal,
        },
      ];
    }, []) as IKipuRowComparedData[];
}