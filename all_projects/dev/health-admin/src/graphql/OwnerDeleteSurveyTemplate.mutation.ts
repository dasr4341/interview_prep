import { gql } from '@apollo/client';

export const OwnerDeleteSurveyTemplateMutation = gql`
  mutation OwnerDeleteSurveyTemplate($templateId: String!) {
    pretaaHealthAdminDeleteSurveyTemplate(templateId: $templateId)
  }
`;
