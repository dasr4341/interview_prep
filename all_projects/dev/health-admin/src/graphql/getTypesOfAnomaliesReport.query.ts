import { gql } from '@apollo/client';

export const getTypesOfAnomaliesReport = gql`
  query GetTypesOfAnomaliesReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetTypesOfAnomaliesReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    name
    key
    count
  }
}

`;
