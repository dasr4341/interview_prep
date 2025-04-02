import { gql } from '@apollo/client';

/**
 * Role: pretaa admin 
 * Add facility this will returns locations if locations available for EMR 
 */
export const adminCreateFacility = gql`
   mutation AdminCreateFacility(
    $pretaaHealthAdminCreateFacilityAccountId2: String!
    $facilityName: String
    $sourceSystemId: String!
    $dynamicFields: [SourceSystemFieldInput!]!
    $timeZone: String
    $offset: String!
    $platformType: PlatformTypes!
    $fetchCareTeam: Boolean
  ) {
    pretaaHealthAdminCreateFacility(
      accountId: $pretaaHealthAdminCreateFacilityAccountId2
      facilityName: $facilityName
      sourceSystemId: $sourceSystemId
      dynamicFields: $dynamicFields
      timeZone: $timeZone
      offset: $offset
      platformType: $platformType
      fetchCareTeam: $fetchCareTeam
    ) {
      facilityId
      facilityName
      locations {
        locationName
        enabled
        locationId
        exists
      }
    }
  }
`;
