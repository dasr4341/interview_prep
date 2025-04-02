import { gql } from '@apollo/client';

export const deleteAndArchiveCampaign = gql`
mutation DeleteCampaignSurvey($campaignSurveyId: String!) {
  pretaaHealthDeleteCampaignSurvey(campaignSurveyId: $campaignSurveyId)
}`;

