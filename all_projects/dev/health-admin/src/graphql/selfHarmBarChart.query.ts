import { gql } from '@apollo/client';

export const selfHarmBarChartQuery = gql`
  query SelfHarmBarChart(
  $filterUsers: [RepotingPatientUsers!]
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $filterMonthNDate: EventReportingDateFilterTypes
  $lastNumber: Float
) {
  pretaaHealthGetDayWiseSuicidalIdeationReport(
    filterUsers: $filterUsers
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    filterMonthNDate: $filterMonthNDate
    lastNumber: $lastNumber
  ) {
    list {
      label
      severalDays
      moreThanHalfDays
      nearlyEveryDay
    }
    avgSeveralDays
  }
}

`;
