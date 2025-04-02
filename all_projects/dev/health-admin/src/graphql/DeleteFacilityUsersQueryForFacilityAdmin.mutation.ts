import { gql } from '@apollo/client';

export const DeleteFacilityUsersForFacilityAdminQuery = gql`
query DeleteFacilityUsersForFacilityAdmin($userType: FacilityUserDeletionRoles!, $userIds: [String!]!, $all: Boolean!) {
  pretaaHealthFacilityDeleteUsersForFacilityAdmins(userType: $userType, userIds: $userIds, all: $all)
}`;


