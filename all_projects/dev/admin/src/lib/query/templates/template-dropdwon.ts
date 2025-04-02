import { gql } from '@apollo/client';

export const getTemplatesDropDown = gql`
 query GetTemplatesDropDown($skip: Int, $take: Int, $keyword: String) {
    pretaaGetEmailTemplatesCreatedOrSharedOrAssigned(skip: $skip, take: $take, searchPhrase: $keyword) {
      id
      title
    }
  }
`;
