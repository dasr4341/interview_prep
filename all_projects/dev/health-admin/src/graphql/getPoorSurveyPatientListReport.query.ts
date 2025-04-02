import { gql } from '@apollo/client';

export const getPoorSurveyPatientListReportQuery = gql`
  query GetPoorSurveyPatientListReport(
    $skip: Int
    $take: Int
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetPoorSurveyPatientListReport(
      skip: $skip
      take: $take
      all: $all
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      lastNumber: $lastNumber
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
    ) {
      columns
      listData
    }
  }
`;
