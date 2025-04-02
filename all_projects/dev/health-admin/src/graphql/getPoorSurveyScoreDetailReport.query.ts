import { gql } from '@apollo/client';

export const getPoorSurveyScoreDetailsReport = gql`
  query GetPoorSurveyScoresDetailsReport(
    $code: String!
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetPoorSurveyScoresDetailsReport(
      code: $code
      all: $all
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      lastNumber: $lastNumber
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
    ) {
      list {
        key
        label
        value
      }
      summary {
        templateName
        total
      }
    }
  }
`;
