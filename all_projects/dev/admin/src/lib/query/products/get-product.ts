import { gql } from '@apollo/client';

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($productId: String!) {
    pretaaGetCompanyProduct(productId: $productId) {
      id
      name
      company {
        id
        name
      }
      orderTerms
      quantity
      monthlyUnitPrice
      orderEndDate
      orderStartDate
      totalPrice
      companyId
      company {
        name
      }
    }
  }
`;
