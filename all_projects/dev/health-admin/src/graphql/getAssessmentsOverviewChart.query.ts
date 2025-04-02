
import { gql } from '@apollo/client';

export const getAssessmentsOverviewChartQuery = gql`
query GetAssessmentsOverviewChart(
  $all: Boolean!
  $filterMonthNDate: ReportingDateFilter
  $rangeStartDate: String
  $rangeEndDate: String
  $patients: [AssessmentReportingPatientsIds!]
  $admittanceStatus: AssessmentPatientsDischargeFilterTypes
) {
  pretaaHealthGetAssessmentsOverviewChart(
    all: $all
    filterMonthNDate: $filterMonthNDate
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    patients: $patients
    admittanceStatus: $admittanceStatus
  ) {
    legends {
      key
      value
    }
    data {
      assignment {
        completed {
          key
          value
          count
        }
        incomplete {
          key
          value
          count
        }
      }
      label
    }
  }
}
`;

