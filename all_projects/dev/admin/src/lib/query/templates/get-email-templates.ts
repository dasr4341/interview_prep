import { gql } from '@apollo/client';

export const GetEmailTemplates = gql`
  query GetTemplates($skip: Int, $take: Int) {
    pretaaGetEmailTemplatesCreatedOrSharedOrAssigned(skip: $skip, take: $take) {
      id
      title
      subject
      text
      creator {
        id
        name
      }
    }
  }
`;
