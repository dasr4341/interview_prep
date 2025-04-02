import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAILS_QUERY = gql`
  query GetProductDetails($productId: String!, $take: Int!, $skip: Int!, $opportunityId: String, $companyId: String) {
    pretaaGetCompanyProduct(productId: $productId) {
      name
      id
    }

    pretaaGetProductOpportunities(
      productId: $productId
      take: $take
      skip: $skip
      opportunityId: $opportunityId
      companyId: $companyId
    ) {
      id
      opportunityId
      productId
      orderStartDate
      orderEndDate
      orderTerms
      monthlyUnitPrice
      totalPrice
      quantity
      opportunity {
        name
        id
        company {
          name
          id
        }
      }
      product {
        name
      }
    }
  }
`;
