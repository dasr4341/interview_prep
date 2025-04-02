import { gql } from '@apollo/client';

/**
 * Role: Super Admin, Facility Admin 
 */
export const addStaffMutation = gql`
 mutation AddStaff(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $userType: [UserStaffTypes!]!
    $facilityIds: [String!]
    $careTeamTypes: [CareTeamTypes!]
  ) {
    pretaaHealthAddStaffUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      userType: $userType
      facilityIds: $facilityIds
      careTeamTypes: $careTeamTypes
    )
  }
`;
