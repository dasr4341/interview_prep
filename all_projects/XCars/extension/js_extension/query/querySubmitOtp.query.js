const querySubmitOtp = `mutation VerifyLoginPhoneOtp($phoneNumber: String!, $otp: String!) {
    verifyLoginPhoneOtp(phoneNumber: $phoneNumber, otp: $otp) {
      message
      success
      signInToken {
        accessToken
        refreshToken
      }
      dealerId
    }
  }`;

export default querySubmitOtp;