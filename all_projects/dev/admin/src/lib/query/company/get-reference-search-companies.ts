import { gql } from '@apollo/client';

export const GetReferenceSearchCompaniesQuery = gql`
  query GetReferenceSearchCompanies(
    $excludeId: String
    $skip: Int
    $take: Int
    $searchPhrase: String
  ) {
    pretaaSearchCompanies(
      excludeId: $excludeId
      skip: $skip
      take: $take
      searchPhrase: $searchPhrase
    ) {
      id
      name
      
    }
  }
`;
