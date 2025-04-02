import { gql } from '@apollo/client';

export const createFacility = gql`
mutation CreateFacility(
  $facilityName: String!
  $facilityUsers: FacilityUsersObjectArgs!
  $sourceSystemId: String!
  $patientProcessId: String!
  $dynamicFields: [SourceSystemFieldInput!]!
  $timeZone: String!
  $offset: String!
  $platformType: PlatformTypes!
) {
  pretaaHealthCreateFacility(
    facilityName: $facilityName
    facilityUsers: $facilityUsers
    sourceSystemId: $sourceSystemId
    patientProcessId: $patientProcessId
    dynamicFields: $dynamicFields
    timeZone: $timeZone
    offset: $offset
    platformType: $platformType
  ) {
    id
  }
}
`;
