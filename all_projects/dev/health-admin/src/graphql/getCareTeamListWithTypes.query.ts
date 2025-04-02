import { gql } from '@apollo/client';

export const getCareTeamListWithType = gql`
query CareTeamListWithTypes {
  pretaaHealthCareTeamListWithTypes {
    careTeamDetailsToCareTeamTypes
    firstName
    id
    lastName
  }
}
`;
