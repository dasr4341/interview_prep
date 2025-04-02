import { gql } from '@apollo/client';

export const viewFacilityForAdmin = gql`
 query AdminGetSourceSystemValuesByFacilityId($facilityId: String!) {
  pretaaHealthAdminGetSourceSystemValuesByFacilityId(facilityId: $facilityId) {
    value
    sourceSystemFieldId
    placeholder
    order
    name
    locationId
    id
    facilityId
    deletedAt
    createdAt
  }
}
`;