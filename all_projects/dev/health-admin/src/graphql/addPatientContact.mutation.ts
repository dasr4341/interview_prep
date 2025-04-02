import { gql } from '@apollo/client';

/**
 * Role: 
 * Add Patient Contact 
 */
export const addPatientContact = gql`
  mutation EHRAddPatientContact(
  $name: String!, 
  $phone: String!, 
  $relationship: RelationshipTypes, 
  $address: String, 
  $notes: String, 
  $alternativePhone: String, 
  $company: String, 
  $dob: String, 
  $url: String, 
  $patientEhrContactType: PatientEHRContactType, 
  $email: String
  ) {
  pretaaHealthEHRAddPatientContact(
  name: $name, 
  phone: $phone, 
  relationship: $relationship, 
  address: $address, 
  notes: $notes, 
  alternativePhone: $alternativePhone, 
  company: $company, 
  dob: $dob, 
  url: $url, 
  patientEHRContactType: $patientEhrContactType, 
  email: $email
  )
}
`;
