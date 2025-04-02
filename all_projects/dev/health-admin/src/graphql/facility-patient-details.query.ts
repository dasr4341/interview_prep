import { gql } from '@apollo/client';

export const patientListByFacilityId = gql`
  query PatientListByFacilityId($facilityId: String!, $userType: FacilityFilterUserTypes!, $take: Int, $skip: Int) {
    pretaaHealthFacilityPatients(facilityId: $facilityId, userType: $userType, take: $take, skip: $skip) {
      patientDetails {
        patientLocation {
          locationName
        }
        inPatient
        dischargeDate
      }
      phone
      id
      active
      lastName
      firstName
      email
      invitationStatus
      lastLoginTime
      PatientContactList {
        suppoters {
          firstName
        }
        patientContacts {
          fullName
        }
      }
      phone
      createdAt
    }
  }
`;
