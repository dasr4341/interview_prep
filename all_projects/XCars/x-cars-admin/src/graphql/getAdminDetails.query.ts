import { graphql } from '@/generated/gql';

export const GET_ADMIN_DETAILS_QUERY = graphql(`
  query GetAdminDetailsQuery {
    getAdminDetails {
      id
      firstName
      lastName
      email
    }
  }
`);
