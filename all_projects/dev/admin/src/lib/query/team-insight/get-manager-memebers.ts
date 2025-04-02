import { gql } from '@apollo/client';

export const getManagerMembersQuery = gql`
  query PretaaGetManagerMembers($reporteeUserId: String!, $skip: Int, $take: Int, $searchPhrase: String) {
    pretaaGetManagerMembers(reporteeUserId: $reporteeUserId, skip: $skip, take: $take, searchPhrase: $searchPhrase) {
      id
      name
    }
  }
`;
