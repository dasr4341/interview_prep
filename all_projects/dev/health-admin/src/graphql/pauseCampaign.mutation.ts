import { gql } from '@apollo/client';

export const pauseCampaignMutation = gql`
mutation PauseCampaign($surveyId: String!, 
  $campaignStatus: Boolean!) {
    pretaaHealthPauseCampaign(campaignSurveyId: $surveyId, 
      campaignStatus: $campaignStatus) {
      id
      pause
    }
}
`;
