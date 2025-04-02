import { graphql } from '@/generated/gql';

export const UPDATE_END_USER = graphql(`
  mutation UpdateEndUserDetail(
    $firstName: String
    $lastName: String
    $email: String
    $location: String
  ) {
    updateEndUserDetail(
      firstName: $firstName
      lastName: $lastName
      email: $email
      location: $location
    ) {
      message
      success
      data {
        id
        firstName
        lastName
        location
        email
        phoneNumber
      }
    }
  }
`);

export const UPDATE_DEALER = graphql(`
  mutation UpdateDealer(
    $dealerId: String
    $firstName: String
    $lastName: String
    $companyName: String
    $location: String
    $email: String
  ) {
    updateDealer(
      dealerId: $dealerId
      firstName: $firstName
      lastName: $lastName
      companyName: $companyName
      location: $location
      email: $email
    ) {
      message
      success
      data {
        id
        firstName
        lastName
        companyName
        location
        status
        email
        phoneNumber
        documents {
          id
          userId
          fileName
          path
        }
      }
    }
  }
`);

export const SEND_REGISTER_OTP = graphql(`
  mutation RegisterDealerWithPhoneNumberViaOtp($phoneNumber: String!) {
    registerDealerWithPhoneNumberViaOtp(phoneNumber: $phoneNumber) {
      message
      success
    }
  }
`);
