import { gql } from '@apollo/client';

export const updatePatientContact = gql`
  mutation EHRUpdatePatientContact(
  $patientContactId: String!, 
  $name: String!, $phone: String!, 
  $patientEhrContactType: PatientEHRContactType, 
  $relationship: RelationshipTypes,
   $notes: String, 
   $address: String, 
   $alternativePhone: String, 
   $company: String, 
   $dob: String, 
   $url: String
   ) {
  pretaaHealthEHRUpdatePatientContact(
  patientContactId: $patientContactId, 
  name: $name, 
  phone: $phone, 
  patientEHRContactType: $patientEhrContactType, 
  relationship: $relationship, 
  notes: $notes, 
  address: $address, 
  alternativePhone: $alternativePhone, 
  company: $company, 
  dob: $dob, 
  url: $url
  )
}
`;
