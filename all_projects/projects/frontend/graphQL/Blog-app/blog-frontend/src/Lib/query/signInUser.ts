import { gql } from "@apollo/client";

export const SIGN_IN_USER = gql`
  mutation ($signInUserData: signInUserInput!) {
    signInUser(signInUserData: $signInUserData) {
      token
    }
  }
`;