import { gql } from '@apollo/client';

export const getEmailTemplateSharedAssignedDataQuery = gql`
  query GetEmailTemplateSharedAssignedDataQuery($templateId: MessageTemplateWhereUniqueInput!) {
    pretaaGetEmailTemplate(whereUniqueInput: $templateId) {
      messageTemplateUsers {
        id
        isShared
        userId
        user {
          name
          email
        }
      }
      messageTemplateGroups {
        id
        isShared
        groupId
        group {
          name
          _count {
            users
          }
        }
      }
    }
  }
`;
