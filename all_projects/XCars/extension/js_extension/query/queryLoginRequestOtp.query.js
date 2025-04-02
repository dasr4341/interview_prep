const queryLoginRequestOtp = `mutation ContactFormSubmit($registerInput: ContactFormRegisterInput, $formData: ContactDataDTO!) {
    contactFormSubmit(registerInput: $registerInput, formData: $formData) {
      message
      success
    }
}`;

export default queryLoginRequestOtp;
