import { gql } from '@apollo/client';

export const GetAllCareTeamTypeQuery = gql`
  query GetAllCareTeamType {
  pretaaHealthGetAllCareTeamType {
    enumType
    defaultValue
    updatedValue
    description
  }
}

`;
