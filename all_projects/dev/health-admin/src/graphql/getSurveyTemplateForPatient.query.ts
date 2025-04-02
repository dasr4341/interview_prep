import { gql } from '@apollo/client';

export const getSurveyTemplateForPatientQuery = gql`
  query GetSurveyTemplateForPatient($templateId: String!) {
    pretaaHealthGetTemplate(templateId: $templateId) {
      title
      name
      type
    }
  }
`;
