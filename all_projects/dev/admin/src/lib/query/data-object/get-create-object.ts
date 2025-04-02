import { gql } from '@apollo/client';

export const getDataObjectsQuery = gql`
  query GetDataObjects {
    pretaaGetDataObjects {
      id
      name
      displayName
      dataSource {
        sourceType
      }
    }
  }
`;
