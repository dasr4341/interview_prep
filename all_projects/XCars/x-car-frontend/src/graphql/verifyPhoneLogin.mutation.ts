import { graphql } from '@/generated/gql';

export const VERIFY_LOGIN_PHONE_MUTATION = graphql(`
  mutation VerifyLoginPhoneOtp($phoneNumber: String!, $otp: String!) {
    verifyLoginPhoneOtp(phoneNumber: $phoneNumber, otp: $otp) {
      message
      success
      signInToken {
        accessToken
        refreshToken
      }
      dealerId
    }
  }
`);
