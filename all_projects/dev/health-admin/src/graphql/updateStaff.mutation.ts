import { gql } from '@apollo/client';

export const updateStaffMutation = gql`
mutation UpdateStaff(
  $staffId: String!
  $email: String!
  $phone: String!
  $userType: [UserStaffTypes!]!
  $firstName: String
  $lastName: String
  $facilityIds: [String!]
  $careTeamTypes: [CareTeamTypes!]
) {
  pretaaHealthUpdateStaffUser(
    staffId: $staffId
    email: $email
    phone: $phone
    userType: $userType
    firstName: $firstName
    lastName: $lastName
    facilityIds: $facilityIds
    careTeamTypes: $careTeamTypes
  )
}
`;
