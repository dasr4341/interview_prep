import { gql } from '@apollo/client';

export const deleteSurvey = gql`
mutation DeleteSurvey($surveyId: String!) {
  pretaaHealthDeleteSurvey(surveyId: $surveyId)
}`;

