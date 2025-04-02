import { gql } from '@apollo/client';

export const SendOtpStepTwoMutation = gql`
mutation SendOtpStepTwo($otp: Int!) {
  pretaaHealthTwoFactorAuthentication(otp: $otp) {
    twoFactorAuthentication
  }
}
`; 