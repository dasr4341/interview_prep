import { gql } from '@apollo/client';

/**
 * Role: Facility Admin, Super Admin 
 * Get assessment information for prefill the form 
 */

export const singleCampaignView = gql`
  query SingleCampaignSurvey($campaignSurveyId: String!) {
    pretaaHealthGetCampaignSurvey(campaignSurveyId: $campaignSurveyId) {
      campaignSurveyCompletionDay
      campaignSurveyEndDate
      campaignSurveyFrequencyCustomData
      campaignSurveyFrequencyType
      campaignSurveySignature
      delayOfDays
      delay
      deletedAt
      facilityId
      id
      scheduledAt
      publishedAt
      published
      stats
      surveyGroup {
        groupName
      }
      surveyTemplateId
      surveyType
      title
      startDate
      surveyCountPerParticipantType
      triggerType
      surveyRecipients {
        userId
        id
        recipientsFirstName
        recipientsLastName
      }
      surveyAssignmentType
      editable
    }
  }
`;
