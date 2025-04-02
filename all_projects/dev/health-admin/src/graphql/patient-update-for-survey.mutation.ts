import { gql } from '@apollo/client';

export const patientListUpdateForSurvey = gql`
  mutation UpdatePatientListForSurvey(
    $surveyId: String!
    $assignmentPatientIds: [SurveyAssignmentCreatePatientSetArgs!]
    $campaignSurveySignature: Boolean
    $sendNow: Boolean
    $scheduledAt: DateTime
  ) {
    pretaaHealthUpdateSurvey(
      surveyId: $surveyId
      assignmentPatientIds: $assignmentPatientIds
      campaignSurveySignature: $campaignSurveySignature
      sendNow: $sendNow
      scheduledAt: $scheduledAt
    ) {
    id
  }
  }
`;
