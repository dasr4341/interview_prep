import { gql } from '@apollo/client';

export const getCurrentAdminQuery = gql`
  query GetCurrentAdminUser {
    pretaaAdminCurrentUser {
      id
      email
      title
      timezone
      adminUserRoles {
        role {
          id
          name
          capabilities
        }
      }
    }
    pretaaAdminGetCurrentUserPermission {
      label
      capabilities {
        VIEW
        EDIT
        CREATE
        EXECUTE
        DELETE
      }
      name
    }
  }
`;
