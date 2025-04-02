import { gql } from '@apollo/client';

export const facilityUserListForImpersonation = gql`
  query FacilityUserListForSuperAndFacilityAdmin(
    $take: Int
    $getActiveFacility: Boolean
    $searchName: String
    $skip: Int
  ) {
    pretaaHealthImpersonationListFacilities(
      take: $take
      getActiveFacility: $getActiveFacility
      searchName: $searchName
      skip: $skip
    ) {
      id
      name
      primaryAdmin {
        id
      }
    }
  }
`;
