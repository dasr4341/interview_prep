import { gql } from '@apollo/client';

export const getHelpLineReport = gql`
query GetHelplineReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetHelplineReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    stats {
      label
      helplineTextCount
      helplineCallCount
    }
    textAvg
    callAvg
  }
}

`;
