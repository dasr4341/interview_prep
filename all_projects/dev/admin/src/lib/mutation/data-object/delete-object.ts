import { gql } from '@apollo/client';

export const DeleteDataObjectsMutation = gql`
  mutation DeleteDataObjectsCollection($id: String!) {
    pretaaDeleteDataObjectsCollection(id: $id) {
      id
    }
  }
`;
