import { gql } from '@apollo/client';

export const patientListOpenStatsQuery = gql`
  query PatientListForOpenStats(
    $all: Boolean!
    $assessmentNumber: Int!
    $filterMonthNDate: ReportingDateFilter
    $rangeStartDate: String
    $rangeEndDate: String
    $admittanceStatus: AssessmentPatientsDischargeFilterTypes
    $patients: [AssessmentReportingPatientsIds!]
    $code: StandardTemplate!
  ) {
    pretaaHealthPatientListForTemplateStatsIncomplete(
      all: $all
      assessmentNumber: $assessmentNumber
      filterMonthNDate: $filterMonthNDate
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      admittanceStatus: $admittanceStatus
      patients: $patients
      code: $code
    ) {
      headers
      rows {
        patientId
        data {
          assessmentNumber
          description
          percent {
            value
            direction
            color
          }
          value
        }
        ID
      }
    }
  }
`;
