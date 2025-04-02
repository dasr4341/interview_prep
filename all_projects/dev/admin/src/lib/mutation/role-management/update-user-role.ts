import { gql } from '@apollo/client';

export const AddUpdateRoleMutation = gql`
  mutation AddUpdateRole($roles: [String!]!, $userId: String!) {
    pretaaAddUpdateRole(roles: $roles, userId: $userId)
  }
`;
