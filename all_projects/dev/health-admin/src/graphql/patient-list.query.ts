import { gql } from '@apollo/client';

export const patientManagementQuery = gql`
query PatientsForAgGrid($patientFilters: [String!], $search: String, $skip: Int, $take: Int) {
  pretaaHealthGetPatients(patient_filters: $patientFilters, search: $search, skip: $skip, take: $take) {
    UserPatientMeta {
      hidden
    }
    firstName
    id
    lastName
    userType
    email
    patientDetails {
      phone
      inPatient
      lastLogin
      dischargeDate
      dob
      building {
        address
        id
        name
      }
      addressCity
      addressCountry
      addressStreet
      addressStreet2
      addressZip
      admissionDate
      dischargeType
      firstContactName
      referrerName
      insuranceCompany
      levelOfCare
      maidenName
      gender
      genderIdentity
      race
      ethnicity
      state
      patientLocation {
        locationName
      }
      lastSyncTime
      lastWeeklyReportAt
      lastMonthlyReportAt
      lastDailyReportAt
      anticipatedDischargeDate
      emrSyncTime
    }
    PatientContactList {
      suppoters {
        firstName
        lastName
      }
      patientContacts {
        fullName
      }
      careTeams {
        firstName
        lastName
        id
      }
    }
    invitationStatus
    phone
    active
    lastLoginTime
    createdAt
    middleName
    trackLocation
    kipuVerified
    caseManager {
      id
      firstName
      lastName
    }
    primaryTherapist {
      id
      firstName
      lastName
    }
    patientTimezone
    facility {
      name
    }
  }
}
`;
