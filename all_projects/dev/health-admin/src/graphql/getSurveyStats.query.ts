import { gql } from '@apollo/client';

export const getSurveyStats = gql`
  query GetSurveyStats($surveyId: String!) {
    pretaaHealthGetSurveyStats(surveyId: $surveyId) {
      completePercentage
      createdAt
      openPercentage
      patients
      surveyId
    }
  }
`;
