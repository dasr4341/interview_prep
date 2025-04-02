import { graphql } from '@/generated/gql';

export const LOGIN_MUTATION = graphql(`
  mutation CustomerLoginWithPhoneOtp($phoneNumber: String!) {
    customerLoginWithPhoneOtp(phoneNumber: $phoneNumber) {
      message
      success
    }
  }
`);
