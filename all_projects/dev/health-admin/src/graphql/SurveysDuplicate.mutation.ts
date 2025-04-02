import { gql } from '@apollo/client';

export const surveysDuplicate = gql`

  mutation PretaaHealthDuplicateSurvey($surveyId: String!, $title: String, $scheduledAt: String) {
  pretaaHealthDuplicateSurvey(surveyId: $surveyId, title: $title, scheduledAt: $scheduledAt)
}
`;

