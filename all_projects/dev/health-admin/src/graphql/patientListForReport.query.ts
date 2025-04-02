import { gql } from '@apollo/client';

export const patientListForReport = gql`
  query PatientListForReport($patientFilters: [String!], $search: String, $skip: Int, $take: Int) {
    pretaaHealthGetPatientsForCounsellor(patient_filters: $patientFilters, search: $search, skip: $skip, take: $take) {
      id
      firstName
      lastName
    }
  }
`;
