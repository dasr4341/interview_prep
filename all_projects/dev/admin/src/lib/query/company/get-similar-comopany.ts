import { gql } from '@apollo/client';

export const GetSimilarCompaniesQuery = gql`
  query GetSimilarCompanies(
    $companyId: String!, 
    $skip: Int, 
    $take: Int
  ) {
    pretaaGetSimilarCompanies(
      companyId: $companyId, 
      skip: $skip, 
      take: $take
    ) {
      companies {
        id
        name
      }
      params
    }
  }
`;