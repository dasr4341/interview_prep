import { graphql } from '@/generated/gql';

export const QUOTE_FORM_MUTATION = graphql(`
  mutation ContactFormSubmit(
    $formData: ContactDataDTO!
    $registerInput: ContactFormRegisterInput
  ) {
    contactFormSubmit(formData: $formData, registerInput: $registerInput) {
      message
      success
    }
  }
`);
