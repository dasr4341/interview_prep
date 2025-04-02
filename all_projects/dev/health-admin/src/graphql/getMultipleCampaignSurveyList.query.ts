import { gql } from '@apollo/client';

export const getMultipleCampaignSurveyListQuery = gql`
  query GetMultipleCampaignSurveyList($campaignSurveyId: String!) {
    pretaaHealthGetMultipleCampaignSurveyList(
      campaignSurveyId: $campaignSurveyId
    ) {
      date
      surveyAssignmentId
      surveyId
      data
      protectiveFactors
      radinessScore
      riskFactors
      usageFactors
    }
    pretaaHealthGetPhqGad7StatsDescription(assignmentId: $campaignSurveyId) {
      description
    }
  }
`;
