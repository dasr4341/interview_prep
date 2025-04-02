import { gql } from '@apollo/client';

export const DeleteFacilityUsersForSuperAdminQuery = gql`
  query DeleteFacilityUsersForSuperAdmin(
    $facilityId: String!
    $userIds: [String!]!
    $all: Boolean!
    $userType: FacilityUserDeletionRoles!
  ) {
    pretaaHealthFacilityDeleteUsers(facilityId: $facilityId, userIds: $userIds, all: $all, userType: $userType)
  }
`;
