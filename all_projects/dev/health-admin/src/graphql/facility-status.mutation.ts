import { gql } from '@apollo/client';

export const adminFacilityStatus = gql`
  mutation PretaaHealthAdminFacilityStatus($facilityId: String!, $facilityStatus: Boolean!) {
    pretaaHealthAdminFacilityStatus(facilityId: $facilityId, facilityStatus: $facilityStatus) {
      isActive
    }
  }
`;
