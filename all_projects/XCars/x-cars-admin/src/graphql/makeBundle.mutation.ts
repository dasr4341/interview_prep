import { graphql } from '@/generated/gql';

export const MAKE_BUNDLE_PRODUCTS = graphql(`
  mutation MakeBundle(
    $carId: String!
    $productIds: [String!]!
    $name: String!
    $amount: Int!
    $discountedAmount: Int
  ) {
    makeBundle(
      carId: $carId
      productIds: $productIds
      name: $name
      amount: $amount
      discountedAmount: $discountedAmount
    ) {
      message
      success
    }
  }
`);
