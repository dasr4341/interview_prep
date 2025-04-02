import { graphql } from '@/generated/gql';

export const REGISTER_MUTATION = graphql(`
  mutation RegisterUser(
    $phoneNumber: String!
    $firstName: String
    $lastName: String
  ) {
    registerUser(
      phoneNumber: $phoneNumber
      firstName: $firstName
      lastName: $lastName
    ) {
      message
      success
    }
  }
`);
