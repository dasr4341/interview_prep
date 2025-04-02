import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query GetUser {
    currentUser {
      id
      customerId
      email
      firstName
      lastName
      title
      twoFactorAuthentication
      department
      customer {
        oktaDomain
        name
        onboarded
      }
      roles {
        roleId
        role {
          name
        }
      }
    }
    pretaaGetCurrentUserPermission {
      name
      label
      capabilities {
        VIEW
        EDIT
        CREATE
        EXECUTE
        DELETE
      }
    }
  }
`;
