import { gql } from '@apollo/client';

export const eHRGetPatientGenderIdentityTypes = gql`
  query EHRGetPatientGenderIdentityTypes {
    pretaaHealthEHRGetPatientGenderIdentityTypes {
      name
      value
    }
  }
`;
