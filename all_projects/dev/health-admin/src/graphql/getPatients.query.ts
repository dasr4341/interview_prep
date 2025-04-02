import { gql } from '@apollo/client';

export const getPatientQuery = gql`
query GetPatientsForLocations($patientFilters: [String!], $take: Int, $skip: Int, $search: String) {
  pretaaHealthGetPatientsForCounsellor(patient_filters: $patientFilters, take: $take, skip: $skip, search: $search) {
    firstName
    id
    lastName
  }
}
`;
