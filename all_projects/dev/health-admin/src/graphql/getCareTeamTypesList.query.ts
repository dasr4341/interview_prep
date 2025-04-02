import { gql } from '@apollo/client';

export const getCareTeamTypesListQuery = gql`
  query GetCareTeamTypesList {
    pretaaHealthGetCareTeamTypesList {
      name
      value
    }
  }
`;