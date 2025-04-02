import { gql } from '@apollo/client';

export const listStaffQuery = gql`
   query ListStaff($userType: UserStaffTypes!, $search: String, $take: Int, $skip: Int) {
    pretaaHealthListStaffUser(userType: $userType, search: $search, take: $take, skip: $skip) {
      mobilePhone
      lastName
      lastLoginTime
      id
      firstName
      email
      editable
      active
      ehrType
      invitationStatus
      fullName
      facilityName
    }
  }
`;