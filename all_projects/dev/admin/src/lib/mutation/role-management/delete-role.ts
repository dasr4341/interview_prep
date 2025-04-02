import { gql } from '@apollo/client';

export const DeleteRoleMutation = gql`
  mutation DeleteRole($id: String!) {
    pretaaDeleteRole(id: $id) {
      id
    }
  }
`;
