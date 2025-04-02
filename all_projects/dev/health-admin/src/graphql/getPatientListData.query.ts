import { gql } from '@apollo/client';

export const getPatientListQuery = gql`
query GetPatientListData($patientFilters: [String!], $take: Int, $skip: Int, $search: String) {
  pretaaHealthGetPatientsForCounsellor(patient_filters: $patientFilters, take: $take, skip: $skip, search: $search) {
    UserPatientMeta {
      hidden
    }
    firstName
    id
    lastName
    userType
  }
}
`;
