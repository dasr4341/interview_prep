import { gql } from '@apollo/client';

export const GET_OPPORTUNITY_PRODUCTS_QUERY = gql`
  query PretaaGetOpprtunityProducts($opportunityId: String!) {
    pretaaGetOpprtunityProducts(opportunityId: $opportunityId) {
      id
      product {
        name
        id
      } 
    }
  }
`;
