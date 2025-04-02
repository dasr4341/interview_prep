import { gql } from '@apollo/client';

export const getCampaignListByTemplateId = gql`
  query GetCampaignListByTemplateId(
    $surveyTemplateId: String!
    $skip: Int
    $take: Int
    $searchPhrase: String
    $surveyCountPerParticipantType: SurveyCountPerParticipantType!
  ) {
    pretaaHealthGetAllCampaignSurveys(
      surveyTemplateId: $surveyTemplateId
      skip: $skip
      take: $take
      searchPhrase: $searchPhrase
      surveyCountPerParticipantType: $surveyCountPerParticipantType
    ) {
      id
      createdAt
      campaignSurveyFrequencyType
      campaignSurveyEndDate
      createdBy
      title
      pause
      campaignSurveyFrequencyCustomData
      publishedAt
      published
      campaignRecurringOccurenceType
      surveyCountPerParticipantType
      triggerType
      surveyEventType
      startDate
      facility {
        name
      }
      scheduledHourAt
      scheduledMinAt
      currentStatus
    }
  }
`;
