import { gql } from '@apollo/client';

export const ownerCreateMutation = gql`
  mutation OwnerCreate($name: String!) {
    pretaaHealthAdminCreateNewAccount(name: $name) {
    id
    name
  }
  }
`;
