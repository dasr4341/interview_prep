import { gql } from '@apollo/client';

export const updateCampaign = gql`
mutation UpdateCampaignSurvey(
  $surveyCountPerParticipantType: SurveyCountPerParticipantType!
  $name: String!
  $campaignSurveyEndDate: DateTime!
  $campaignSurveyStartDate: DateTime!
  $surveyAssignmentType: CampaignSurveyAssignmentTypes!
  $campaignSurveyReminderCompletionDay: CampaignSurveyReminderCompletion!
  $triggerType: CampaignSurveyTriggerTypes
  $campaignSurveyGroup: [CampaignSurveyGroupType!]
  $recipientsId: [String!]
  $campaignSurveyFrequencyType: CampaignSurveyFrequency
  $campaignSurveyFrequencyCustomData: Int
  $campaignSurveySignature: Boolean
  $delay: Boolean
  $delayOfDays: Int
  $surveyEventType: CampaignSurveyEventTypes
  $campaignSurveyId: String!
  $saveAsDraft: Boolean
) {
  pretaaHealthUpdateCampaignSurvey(
    surveyCountPerParticipantType: $surveyCountPerParticipantType
    name: $name
    campaignSurveyEndDate: $campaignSurveyEndDate
    campaignSurveyStartDate: $campaignSurveyStartDate
    surveyAssignmentType: $surveyAssignmentType
    campaignSurveyReminderCompletionDay: $campaignSurveyReminderCompletionDay
    triggerType: $triggerType
    campaignSurveyGroup: $campaignSurveyGroup
    recipientsId: $recipientsId
    campaignSurveyFrequencyType: $campaignSurveyFrequencyType
    campaignSurveyFrequencyCustomData: $campaignSurveyFrequencyCustomData
    campaignSurveySignature: $campaignSurveySignature
    delay: $delay
    delayOfDays: $delayOfDays
    surveyEventType: $surveyEventType
    campaignSurveyId: $campaignSurveyId
    saveAsDraft: $saveAsDraft
  ) {
    id
  }
}

`;
