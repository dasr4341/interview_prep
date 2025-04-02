import { gql } from '@apollo/client';

export const UpdateRoleMutation = gql`
  mutation UpdateRole(
    $capabilities: [String!]!
    $name: String!
    $id: String!
  ) {
    pretaaUpdateRole(
      capabilities: $capabilities
      name: $name
      id: $id
    )
  }
`;
