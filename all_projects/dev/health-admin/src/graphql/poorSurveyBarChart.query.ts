import { gql } from '@apollo/client';

export const poorSurveyBarChartQuery = gql`
   query PoorSurveyBarChart(
    $skip: Int
    $take: Int
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetDayWisePoorSurveyReport(
      skip: $skip
      take: $take
      all: $all
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      lastNumber: $lastNumber
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
    ) {
      data
      legends {
        key
        value
      }
    }
  }
`;
