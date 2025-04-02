import { gql } from '@apollo/client';

export const updateFacility = gql`
  mutation UpdateFacility(
    $facilityId: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $sourceSystemFields: [UpdateSourceSystemFieldInput!]!
    $facilityName: String
    $timeZone: String!
    $offset: String!
  ) {
    pretaaHealthUpdateFacility(
      facilityId: $facilityId
      email: $email
      firstName: $firstName
      lastName: $lastName
      sourceSystemFields: $sourceSystemFields
      facilityName: $facilityName
      timeZone: $timeZone
      offset: $offset
    ) {
      id
    }
  }
`;
