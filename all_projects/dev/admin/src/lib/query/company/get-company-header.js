import { gql } from '@apollo/client';

export const GetCompanyHeaderQuery = gql`
  query GetCompanyHeader(
    $companyId: String!
  ) {
    pretaaGetCompany(companyId: $companyId) {
      id
      name
      starredByUser {
        userId
      }
    }
  }
`;
