import { gql } from '@apollo/client';

export const GetUseCaseCollectionsQuery = gql`
  query GetUseCaseCollections {
    pretaaGetUseCaseCollections {
      id
      name
      default
    }
  }
`;
