import { gql } from '@apollo/client';

export const getFenceBreadChartReport = gql`
query GetFenceBreachReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetFenceBreachReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    stats {
      label
      fenceBreachInCount
      fenceBreachOutCount
    }
    avgFence
  }
}

`;
