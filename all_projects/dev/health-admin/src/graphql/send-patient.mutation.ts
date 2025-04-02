import { gql } from '@apollo/client';

export const sendPatientSurvey = gql`
mutation CreateSurvey(
  $surveyTemplateId: String!
  $assignmentPatientIds: [SurveyAssignmentCreatePatientSetArgs!]!
  $scheduledAt: DateTime
  $campaignSurveySignature: Boolean
  $sendNow: Boolean
  $facilityId: String
) {
  pretaaHealthCreateSurvey(
    surveyTemplateId: $surveyTemplateId
    assignmentPatientIds: $assignmentPatientIds
    scheduledAt: $scheduledAt
    campaignSurveySignature: $campaignSurveySignature
    sendNow: $sendNow
    facilityId: $facilityId
  ) {
    _count {
      surveyAssignments
      events
      surveyFields
      campaignSurveyGroup
      surveyReminderLog
      SurveyReceipient
    }
    id
  }
}
`;
