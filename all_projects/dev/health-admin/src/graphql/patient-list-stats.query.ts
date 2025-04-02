import { gql } from '@apollo/client';

export const patientListStatsQuery = gql`
  query PatientListForTemplateStats(
    $all: Boolean!
    $assessmentNumber: Int!
    $filterMonthNDate: ReportingDateFilter
    $rangeStartDate: String
    $rangeEndDate: String
    $patients: [AssessmentReportingPatientsIds!]
    $admittanceStatus: AssessmentPatientsDischargeFilterTypes
    $code: StandardTemplate!
  ) {
    pretaaHealthPatientListForTemplateStats(
      all: $all
      assessmentNumber: $assessmentNumber
      filterMonthNDate: $filterMonthNDate
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      patients: $patients
      admittanceStatus: $admittanceStatus
      code: $code
    ) {
      headers
      rows {
        data {
          value
          description
          percent {
            value
            direction
            color
          }
          assessmentNumber
        }
        ID
        patientId
      }
    }
  }
`;
