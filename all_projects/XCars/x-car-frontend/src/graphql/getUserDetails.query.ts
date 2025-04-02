import { graphql } from '@/generated/gql';

export const USER_DETAILS = graphql(`
  query GetUserDetails {
    getUserDetails {
      id
      firstName
      lastName
      email
      phoneNumber
      location
    }
  }
`);
