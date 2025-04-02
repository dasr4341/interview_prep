import { gql } from '@apollo/client';

export const GetUsersAndGroups = gql`
  query GetUsersAndGroups($searchPhrase: String, $take: Int, $skip: Int) {
  pretaaGetUserList(take: $take, skip: $skip, searchPhrase: $searchPhrase) {
    email
    id
    name
  }
  pretaaGetFilteredGroups(
    searchPhrase: $searchPhrase
    take: $take
    skip: $skip
  ) {
    id
    name
    _count {
      users
    }
  }
}
`;
