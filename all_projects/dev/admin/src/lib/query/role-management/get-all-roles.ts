import { gql } from '@apollo/client';

export const ViewAllRolesQuery = gql`
  query ViewAllRoles {
    pretaaViewAllRoles {
      id
      name
      customerId
      isDefault
    }
  }
`;
