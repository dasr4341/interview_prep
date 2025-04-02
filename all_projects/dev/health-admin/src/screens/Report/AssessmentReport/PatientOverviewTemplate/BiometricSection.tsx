import React from 'react';
import useGetPatientAssessmentData from './useGetPatientAssessmentData';
import AssessmentBiometricScale from '../AssessmentBiometricScale';
import { Skeleton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { useAppSelector } from 'lib/store/app-store';
import { BiometricScoreLabel } from '../enum/AssessmentChartColorScheme';

export default function BiometricSection() {
  // biometric stats
  const { patientOverview, loading, isSinglePatient } =
    useGetPatientAssessmentData();
  const assessmentFilter = useAppSelector(
    (state) => state.app.assessmentFilter
  );

  const navigate = useNavigate();

  const navigateToTimeline = (patientId: string, type: BiometricScoreLabel) => {
    navigate(
      routes.assessmentsReport.assessmentReportTimeline.build(patientId, type)
    );
  };

  return (
    <>
      {isSinglePatient && (
        <>
          <Skeleton visible={loading}>
            <div>
              <div className="gap-x-4 xl:gap-x-10 border rounded-xl flex flex-col sm:flex-row items-center justify-between py-10 px-4 xl:px-10 relative bg-white mt-6">
                <div>
                  <div className="w-full sm:w-5/12 xl:w-4/12">
                    <AssessmentBiometricScale
                      biometricScore={
                        patientOverview?.biometricReport as number
                      }
                    />
                  </div>
                  <div className="text-center text-xss text-gray-600 capitalize">
                    Biometrics scale
                  </div>
                </div>

                <div className="w-full lg:w-8/12 grid grid-cols-3 gap-4">
                  <div className="border-r-2 px-5 xl:px-8">
                    <div
                      className={`${
                        patientOverview &&
                        patientOverview.anomaliesReportCount > 0 &&
                        'text-pt-blue-300 underline cursor-pointer'
                      } font-extrabold text-md md:text-smd mb-2 `}
                      onClick={() => {
                        if (
                          patientOverview &&
                          patientOverview.anomaliesReportCount > 0
                        ) {
                          navigateToTimeline(
                            assessmentFilter.selectedPatients.list[0].id,
                            BiometricScoreLabel.Anomalies_Report
                          );
                        }
                      }}>
                      {patientOverview?.anomaliesReportCount}
                    </div>
                    <div className="font-medium text-sm mt-3 text-gray-150 max-width-200 capitalize">
                      Anomalies Reported
                    </div>
                  </div>
                  <div className="border-r-2 px-5 xl:px-8">
                    <div
                      className={`${
                        patientOverview &&
                        patientOverview.geofenceBreachsReportCount > 0 &&
                        'text-pt-blue-300 underline cursor-pointer'
                      } font-extrabold text-md md:text-smd mb-2 `}
                      onClick={() => {
                        if (
                          patientOverview &&
                          patientOverview.geofenceBreachsReportCount > 0
                        ) {
                          navigateToTimeline(
                            assessmentFilter.selectedPatients.list[0].id,
                            BiometricScoreLabel.Geofence_Report
                          );
                        }
                      }}>
                      {patientOverview?.geofenceBreachsReportCount}
                    </div>
                    <div className="font-medium text-sm mt-3 text-gray-150 max-width-200 capitalize">
                      Geofences Activated
                    </div>
                  </div>
                  <div className="px-5 xl:px-8">
                    <div
                      className={`${
                        patientOverview &&
                        patientOverview.helpLineContactedReportCount > 0 &&
                        'text-pt-blue-300 underline cursor-pointer'
                      } font-extrabold text-md md:text-smd mb-2 `}
                      onClick={() => {
                        if (
                          patientOverview &&
                          patientOverview.helpLineContactedReportCount > 0
                        ) {
                          navigateToTimeline(
                            assessmentFilter.selectedPatients.list[0].id,
                            BiometricScoreLabel.HelpLine_Report
                          );
                        }
                      }}>
                      {patientOverview?.helpLineContactedReportCount}
                    </div>
                    <div className="font-medium text-sm mt-3 text-gray-150 max-w-200 capitalize">
                      Help line contacted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Skeleton>
        </>
      )}
    </>
  );
}
