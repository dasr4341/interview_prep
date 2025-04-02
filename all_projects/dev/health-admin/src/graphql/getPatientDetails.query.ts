import { gql } from '@apollo/client';

export const getPatientDetails = gql`
query GetPatientDetails($patientId: String!) {
  pretaaHealthPatientDetails(patientId: $patientId) {
    createdAt
    active
    lastName
    firstName
    id
    email

    patientDetails {
      phone
      bedName
      dischargeDate
      intakeDate
      room
      patientLocation {
        locationName
      }
      gender
    genderIdentity
    dob
    }
    patientContactList {
      careTeams {
        id
        firstName
        lastName
        careTeamTypes
        isPrimary
        fullName
        email
        phone
      }
      patientContacts {
        phone
        relationship
        id
        address
        fullName
        email
        contactType
      }
      suppoters {
        firstName
        lastName
      }
    }
    lastLoginTime
    kipuVerified
    userInvitationStatus
  }
}
`;
