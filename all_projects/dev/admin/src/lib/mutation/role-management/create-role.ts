import { gql } from '@apollo/client';

export const CreateAdminRoleMutation = gql`
  mutation CreateAdminRole($capabilities: [String!]!, $name: String!) {
    pretaaCreateRole(capabilities: $capabilities, name: $name)
  } 
`;
