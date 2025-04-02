import { graphql } from '@/generated/gql';

export const CREATE_ORDER_MUTATION = graphql(`
  mutation CreateOrderForEndUser(
    $carId: String!
    $bundleId: String
    $products: [String!]
  ) {
    createOrderForEndUser(
      carId: $carId
      bundleId: $bundleId
      products: $products
    ) {
      message
      success
      order {
        id
        entity
        amount
        currency
        description
        order_id
        name
        theme {
          color
        }
        prefill {
          name
          email
          contact
        }
      }
    }
  }
`);
