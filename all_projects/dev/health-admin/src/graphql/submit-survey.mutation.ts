import { gql } from '@apollo/client';

export const submitSurvey = gql`
  mutation SubmitSurvey(
    $isCompleted: Boolean
    $surveyFields: [SurveyAttemptCreateArgsFieldSet!]!
    $surveyId: String!
    $browser: String
    $device: String
    $os: String
    $surveyStartedAt: DateTime
    $surveyFinishedAt: DateTime
    $signature: String
  ) {
    pretaaHealthSubmitSurvey(
      isCompleted: $isCompleted
      surveyFields: $surveyFields
      surveyId: $surveyId
      browser: $browser
      device: $device
      os: $os
      surveyStartedAt: $surveyStartedAt
      surveyFinishedAt: $surveyFinishedAt
      signature: $signature
    )
  }
`;
