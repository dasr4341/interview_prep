import { gql } from '@apollo/client';

export const deleteSurveyTemplateMutation = gql`mutation DeleteSurveyTemplate($templateId: String!) {
  pretaaHealthDeleteSurveyTemplate(templateId: $templateId)
}`;