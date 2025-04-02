import { gql } from '@apollo/client';

export const viewPatientContactQuery = gql`
query ViewPatientContact($patientContactId: String!) {
  pretaaHealthViewPatientContact(patientContactId: $patientContactId) {
    address
    alternativePhone
    company
    contactType
    createdAt
    dob
    email
    id
    notes
    patientId
    phone
    relationship
    url
    fullName
  }
}
`;