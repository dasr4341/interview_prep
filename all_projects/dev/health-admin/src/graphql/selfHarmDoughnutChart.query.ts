import { gql } from '@apollo/client';

export const selfHarmDoughnutChartQuery = gql`
  query selfHarmDoughnutChart(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetTypesOfSuicidalIdeationReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    list {
      name
      key
      count
    }
    total
    avgSeveralDays
  }
}

`;
