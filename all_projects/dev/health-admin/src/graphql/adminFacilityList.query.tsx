import { gql } from '@apollo/client';

/**
 * role: pretaa admin 
 * List facilities by account ID 
 */
export const adminFacilityList = gql`
  query AdminListFacilities(
    $accountId: String!
    $getActiveFacility: Boolean
    $searchPhrase: String
    $skip: Int
    $take: Int
    $endDate: DateTime
    $startDate: DateTime
  ) {
    pretaaHealthAdminListFacilities(
      accountId: $accountId
      getActiveFacility: $getActiveFacility
      searchPhrase: $searchPhrase
      skip: $skip
      take: $take
      endDate: $endDate
      startDate: $startDate
    ) {
      id
      isActive
      name
      timeZone
      createdAt
      sourceSystemId
      sourceSystem {
        slug
      }
      activePatients
    }
  }
`;
