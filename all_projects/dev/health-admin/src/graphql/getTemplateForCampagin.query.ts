import { gql } from '@apollo/client';

export const getTemplateForCampaign = gql`
  query GetTemplateForCampaign($templateId: String!) {
    pretaaHealthGetTemplate(templateId: $templateId) {
      name
      description
      id
      type
    }
  }
`;