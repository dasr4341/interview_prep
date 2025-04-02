import { gql } from '@apollo/client';

export const getSummariesCountsReport = gql`
  query GetSummariesCountsReport(
  $filterUsers: [RepotingPatientUsers!]
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
) {
  pretaaHealthGetSummariesCountsReport(
    filterUsers: $filterUsers
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
  ) {
    name
    value
    count
  }
}

`;
