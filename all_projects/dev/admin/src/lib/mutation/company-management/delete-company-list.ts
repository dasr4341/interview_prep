import { gql } from '@apollo/client';

export const DeleteListMutation = gql`
  mutation DeleteList($id: String!) {
    pretaaDeleteList(id: $id)
  }
`;
