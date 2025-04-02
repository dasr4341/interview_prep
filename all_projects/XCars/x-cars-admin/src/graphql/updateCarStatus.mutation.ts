import { graphql } from '@/generated/gql';

export const UPDATE_CAR_STATUS = graphql(`
  mutation UpdateCarStatus($cartData: UpdateCarStatus!) {
    updateCarStatus(cartData: $cartData) {
      message
      success
    }
  }
`);
