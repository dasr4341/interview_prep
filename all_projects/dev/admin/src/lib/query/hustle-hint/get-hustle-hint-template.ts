import { gql } from '@apollo/client';

export const getHustleHintTemplateQuery = gql`
  query GetHustleHintTemplate(
    $templateId: String!) {
      pretaaGetHustleHintTemplate(templateId: $templateId) {
        id
        content
        templateName
        delta
        emailSubject
    }
  }
`;
