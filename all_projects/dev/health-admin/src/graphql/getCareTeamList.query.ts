import { gql } from '@apollo/client';

export const getCareTeamList = gql`
  query EHRSearchCareTeams($take: Int, $skip: Int, $searchPhrase: String, $orderBy: String, $order: OrderType) {
    pretaaHealthEHRSearchCareTeams(take: $take, skip: $skip, searchPhrase: $searchPhrase, orderBy: $orderBy, order: $order) {
      active
      email
      firstName
      lastName
      phone
      id
      userId
      invitationStatus
      lastLogin
      sourceSystem {
        name
      }
    }
  }
`;
