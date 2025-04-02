import { graphql } from '@/generated/gql';

export const VERIFY_PAYMENT_MUTATION = graphql(`
  mutation VerifyRazorpayPaymentForEndUser(
    $razorpayOrderId: String!
    $razorpayPaymentId: String!
    $razorpaySignature: String!
  ) {
    verifyRazorpayPaymentForEndUser(
      razorpayOrderId: $razorpayOrderId
      razorpayPaymentId: $razorpayPaymentId
      razorpaySignature: $razorpaySignature
    ) {
      message
      success
      data {
        paymentId
      }
    }
  }
`);
