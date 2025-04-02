import { gql } from '@apollo/client';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($companyId: String, $opportunityId: String) {
    pretaaCompanyProducts(companyId: $companyId, opportunityId: $opportunityId) {
      name
      customerProductId
    }
  }
`;
