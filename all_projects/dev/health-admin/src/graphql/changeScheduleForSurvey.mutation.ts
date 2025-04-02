import { gql } from '@apollo/client';

export const changeScheduleForSurveyMutation = gql`
mutation ChangeScheduleForSurvey($sendNow: Boolean, $surveyId: String!, $scheduledAt: DateTime) {
  pretaaHealthChangeScheduleForSurvey(sendNow: $sendNow, surveyId: $surveyId, scheduledAt: $scheduledAt)
}
`;

