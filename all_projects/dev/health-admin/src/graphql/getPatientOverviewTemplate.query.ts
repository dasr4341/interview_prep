import { gql } from '@apollo/client';

export const getPatientOverviewTemplateQuery = gql`
  query OverviewTemplateStats(
    $all: Boolean!
    $filterMonthNDate: ReportingDateFilter
    $patients: [AssessmentReportingPatientsIds!]
    $rangeEndDate: String
    $rangeStartDate: String
    $admittanceStatus: AssessmentPatientsDischargeFilterTypes
  ) {
    pretaaHealthOverviewTemplateStats(
      all: $all
      filterMonthNDate: $filterMonthNDate
      patients: $patients
      rangeEndDate: $rangeEndDate
      rangeStartDate: $rangeStartDate
      admittanceStatus: $admittanceStatus
    ) {
      headers
      rows {
        data {
          assessmentNumber
          description
          percent {
            color
            direction
            value
          }
          value
        }
      }
    }
  }
`;
