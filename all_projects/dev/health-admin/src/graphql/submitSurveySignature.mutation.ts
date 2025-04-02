import { gql } from '@apollo/client';

export const submitSurveySignature = gql`
  mutation SubmitSurveySignature($surveyId: String!, $surveySignatureData: String!) {
    pretaaHealthSubmitSurveySignature(surveyId: $surveyId, surveySignatureData: $surveySignatureData)
  }
`;
