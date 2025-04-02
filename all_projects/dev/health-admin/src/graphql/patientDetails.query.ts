import { gql } from '@apollo/client';

export const patientDetailsQuery = gql`
query PatientDetails($patientId: String!) {
  pretaaHealthPatientDetails(patientId: $patientId) {
    createdAt
    active
    lastName
    firstName
    id
    title
    userType
    workPhone
    department
    email
    noteCount
    timelineCount


    patientDetails {
      phone
      dob
      bedName
      daysSober
      diagnosis
      dischargeDate
      emergencyContact
      intakeDate
      room
      inPatient
      paymentMethod
      paymentMethodCategory
      insuranceCompany
      lastLogin
      patientLocation {
        locationName
      }
      gender
    genderIdentity
    dischargeDate
    intakeDate
    }
    patientContactList {
      careTeams {
        id
        firstName
        lastName
        email
        phone
        sourceSystem {
          name
        }
        careTeamTypes
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
        email
        firstName
        lastName
        id
        mobilePhone
      }
    }
    lastLoginTime
    userFacilities {
      name
    }
  }
}
`;
