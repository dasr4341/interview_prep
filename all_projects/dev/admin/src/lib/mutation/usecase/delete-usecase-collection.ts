import { gql } from '@apollo/client';

export const DeleteUseCaseCollectionMutation = gql`
  mutation DeleteUseCaseCollection($id: String!) {
    pretaaDeleteUseCaseCollection(id: $id) {
      id
    }
  }
`;
