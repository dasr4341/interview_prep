import { gql } from '@apollo/client';

export const getPoorSurveyScoreReport = gql`
  query GetPoorSurveyScoresReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetPoorSurveyScoresReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    list {
      template_name
      trigger
      code
    }
    summary {
      total_trigger
      unique_patient
    }
  }
}

`;
