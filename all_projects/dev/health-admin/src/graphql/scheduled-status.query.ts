import { gql } from '@apollo/client';

export const getScheduledSurveyQuery = gql`
  query GetScheduledSurveys($skip: Int, $take: Int, $searchPhrase: String, $status: SurveyStatusTypeFacility) {
    pretaaHealthGetSurveys(skip: $skip, take: $take, searchPhrase: $searchPhrase, status: $status) {
      id
      createdAt
      surveyTemplate {
        id
        title
        name
        type
        description
      }
      title
      scheduledAt
      stats
    }
  }
`;
