import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import {
  GetAssessmentsOverviewPatientsAssessment,
  GetAssessmentsOverviewPatientsAssessmentVariables,
} from 'health-generatedTypes';
import { getPatientAssessmentOverviewQuery } from 'graphql/getPatientAssessmentOverview.query';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';
import { PatientAssessmentOverview } from '../AssementReportForTemplate/assement-report-interface';

export default function useGetPatientAssessmentData() {
  const assessmentFilter = useAppSelector(
    (state) => state.app.assessmentFilter
  );
  const [isSinglePatient, setIsSinglePatient] = useState(false);

  const [patientOverview, setPatientOverview] =
    useState<PatientAssessmentOverview | null>(null);

  const [getPatientAssessmentData, { loading }] =
    useLazyQuery<
      GetAssessmentsOverviewPatientsAssessment,
      GetAssessmentsOverviewPatientsAssessmentVariables
    >(getPatientAssessmentOverviewQuery, {
      onCompleted: (d) => {
        const data = d?.pretaaHealthGetAssessmentsOverviewPatientsAssessment;
        if (data) {
          const list = data.map((el) => {
            return {
              anomaliesReportCount: el.anomaliesReportCount,
              biometricReport: el.biometricReport,
              geofenceBreachsReportCount: el.geofenceBreachsReportCount,
              helpLineContactedReportCount: el.helpLineContactedReportCount,
            };
          });
          setPatientOverview(list[0]);
        }
      },
      onError: (e) => catchError(e, true),
    });

  useEffect(() => {
    setPatientOverview(null);
    
    if (assessmentFilter.selectedPatients.list.length === 1) {
      getPatientAssessmentData({
        variables: {
          ...getReportFilterVariables({ filter: assessmentFilter }),
          patients: [
            {
              patientId: assessmentFilter.selectedPatients.list[0].id,
            },
          ],
        },
      });
    }

    setIsSinglePatient(assessmentFilter.selectedPatients.list.length === 1);

    // 
  }, [assessmentFilter]);

  return {
    assessmentFilter,
    patientOverview,
    loading,
    isSinglePatient
  };
}
