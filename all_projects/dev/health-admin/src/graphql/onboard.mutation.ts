import { gql } from '@apollo/client';

export const patientOnboard = gql`
  mutation PatientOnboard($email: String!, $password: String!, $facilityId: String) {
    pretaaHealthPatientOnboard(email: $email, password: $password, facilityId: $facilityId) {
      loginToken
      message
      refreshToken
      twoFactorAuthToken
      twoFactorAuthentication
    }
  }
`;
