import { graphql } from '@/generated/gql';

export const GET_CUSTOMER_DETAILS = graphql(`
  query GetCustomersDetails($userId: String!) {
    getCustomersDetails(userId: $userId) {
      message
      success
      data {
        id
        firstName
        lastName
        status
        email
        phoneNumber
      }
    }
  }
`);
