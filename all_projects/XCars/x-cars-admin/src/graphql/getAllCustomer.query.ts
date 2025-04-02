import { graphql } from '@/generated/gql';

export const GET_ALL_USERS = graphql(`
  query GetAllCustomers {
    getAllCustomers {
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
