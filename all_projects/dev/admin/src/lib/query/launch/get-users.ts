import { gql } from '@apollo/client';

export const getUsersForTag = gql`
  query GetUsersForTag($take: Int, $searchColumn: String, $searchPhrase: String) {
    pretaaGetUserList(take: $take, searchColumn: $searchColumn, searchPhrase: $searchPhrase) {
      id
      firstName
      lastName
    }
  }
`;
