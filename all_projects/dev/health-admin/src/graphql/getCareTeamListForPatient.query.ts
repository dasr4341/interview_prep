import { gql } from '@apollo/client';

export const getCareTeamListForPatient = gql`
  query ListCareTeamsForPatient($searchPhrase: String) {
    pretaaHealthListCareTeams(searchPhrase: $searchPhrase) {
      firstName
      lastName
      email
      id
      userId
      sourceSystem {
        name
      }
    }
  }
`;
