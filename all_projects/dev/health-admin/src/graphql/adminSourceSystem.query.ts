import { gql } from '@apollo/client';

export const adminSourceSystemQuery = gql`
query AdminSourceSystems {
  pretaaHealthAdminSourceSystems {
    id
    name
    slug
    createdAt
    logo
  }
}
`;
