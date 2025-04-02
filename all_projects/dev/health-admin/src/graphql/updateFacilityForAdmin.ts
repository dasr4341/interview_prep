import { gql } from '@apollo/client';

export const updateFacilityForAdmin = gql`
  mutation AdminUpdateSourceSystemValuesByFacilityId(
  $facilityId: String!
  $dynamicFields: [SourceSystemFieldInput!]!
) {
  pretaaHealthAdminUpdateSourceSystemValuesByFacilityId(
    facilityId: $facilityId
    dynamicFields: $dynamicFields
  )
}
`;

