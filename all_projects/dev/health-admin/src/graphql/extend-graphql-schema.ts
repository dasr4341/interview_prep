import { gql } from '@apollo/client';

export const extendedTypes = gql`
 extend type Query {
    isLoggedIn: Boolean!
  }
`;


export const typePolicies = {
  pretaaHealthCurrentUser: {
    fields: {
      isInCart: Boolean
    }
  }
};
