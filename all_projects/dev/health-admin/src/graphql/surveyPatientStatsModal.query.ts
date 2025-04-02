import { gql } from '@apollo/client';

export const SurveyPatientStatsModal = gql`
  query GetSurveyPatientStats(
    $surveyId: String!
    $dateOfAssignment: String!
    $take: Int
    $skip: Int
  ) {
    pretaaHealthGetSurveyPatientStats(
      surveyId: $surveyId
      dateOfAssignment: $dateOfAssignment
      take: $take
      skip: $skip
    ) {
      finishDate
      finishTime
      isCompleted
      overAllPatientScore
      surveyFinishedAt
      surveyId
      lastName
      firstName
      bamScore
      timeZone
    }
  }
`;
