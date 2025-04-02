import { gql } from '@apollo/client';

export const getPatientAssessmentOverviewQuery = gql`
  query GetAssessmentsOverviewPatientsAssessment(
    $filterMonthNDate: ReportingDateFilter
    $patients: [AssessmentReportingPatientsIds!]
    $rangeEndDate: String
    $rangeStartDate: String
  ) {
    pretaaHealthGetAssessmentsOverviewPatientsAssessment(
      filterMonthNDate: $filterMonthNDate
      patients: $patients
      rangeEndDate: $rangeEndDate
      rangeStartDate: $rangeStartDate
    ) {
      anomaliesReportCount
      biometricReport
      geofenceBreachsReportCount
      helpLineContactedReportCount
    }
  }
`;
