import { gql } from '@apollo/client';

export const getCareTeamListByType = gql`
  query GetCareTeamListByType(
    $skip: Int
    $take: Int
    $searchPhrase: String
    $careTeamType: CareTeamTypes
  ) {
    pretaaHealthGetCareTeamListByType(
      skip: $skip
      take: $take
      searchPhrase: $searchPhrase
      careTeamType: $careTeamType
    ) {
      firstName
      lastName
      userId
      email
    }
  }
`;
