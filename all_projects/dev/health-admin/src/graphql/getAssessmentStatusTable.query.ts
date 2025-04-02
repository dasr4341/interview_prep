import { gql } from '@apollo/client';

export const getAssessmentStatusQuery = gql`
 query GetAssessmentReportingPatientStats(
    $all: Boolean!
    $code: String!
    $filterMonthNDate: ReportingDateFilter
    $patients: [AssessmentReportingPatientsIds!]
    $rangeEndDate: String
    $rangeStartDate: String
    $admittanceStatus: AssessmentPatientsDischargeFilterTypes
  ) {
    pretaaHealthGetAssessmentReportingPatientStats(
      all: $all
      code: $code
      filterMonthNDate: $filterMonthNDate
      patients: $patients
      rangeEndDate: $rangeEndDate
      rangeStartDate: $rangeStartDate
      admittanceStatus: $admittanceStatus
    ) {
      rows {
        data {
          description
          percent {
            value
            direction
            color
          }
          value
          assessmentNumber
        }
        patientId
        ID
      }
      code
      headers
    }
  }
`;
