import { gql } from '@apollo/client';

export const sendSurveyReminder = gql`
mutation SurveyReminder($reminderDate: DateTime!, $surveyAssignId: String!) {
  pretaaHealthSurveyReminder(reminderDate: $reminderDate, surveyAssignId: $surveyAssignId)
}
`;