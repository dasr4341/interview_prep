import { gql } from '@apollo/client';

export const ownerGetTemplatesQuery = gql`
  query OwnerGetTemplates($skip: Int, $take: Int, $searchPhrase: String) {
    pretaaHealthAdminGetTemplates(skip: $skip, take: $take, searchPhrase: $searchPhrase) {
      id
      name
      title
      description
      status
    }
  }
`;
