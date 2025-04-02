import { gql } from '@apollo/client';

export const TwoFactorAuthenticationOTP = gql`
  mutation PretaaTwoFactorAuthenticationOTP {
    pretaaTwoFactorAuthenticationotp
  }
`;

export const TwoFactorAuthentication = gql`
  mutation PretaaTwoFactorAuthentication($otp: Int!) {
    pretaaTwoFactorAuthentication(otp: $otp) {
      twoFactorAuthentication
      twoFactorOTP
      twoFactorAuthToken
    }
  }
`;

export const verifyTwoFactorAuthenticationMutation = gql`
  mutation VerifyTwoFactorAuthentication($twoFactorAuthToken: String!, $otp: Int!) {
    pretaaVerifyTwoFactorAuthentication(twoFactorAuthToken: $twoFactorAuthToken, otp: $otp)
  }
`;
