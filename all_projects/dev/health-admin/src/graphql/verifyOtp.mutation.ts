import { gql } from '@apollo/client';

export const verifyOtpMutation = gql`
  mutation VerifyOtp($otp: Int!, $twoFactorAuthToken: String!) {
    pretaaHealthVerifyTwoFactorAuthentication(otp: $otp, twoFactorAuthToken: $twoFactorAuthToken) {
      loginToken
      refreshToken
    }
  }
`;
