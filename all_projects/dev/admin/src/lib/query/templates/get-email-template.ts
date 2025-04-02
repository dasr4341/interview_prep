import { gql } from '@apollo/client';

export const getEmailTemplateQuery = gql`
  query GetEmailTemplate($templateId: MessageTemplateWhereUniqueInput!) {
    pretaaGetEmailTemplate(whereUniqueInput: $templateId) {
      id
      title
      subject
      text
      delta
      messageType
      eventType
      companyType
      creator {
        id
      }
    }
  }
`;
