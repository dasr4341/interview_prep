import { gql } from '@apollo/client';

export const facilityUserList = gql`
 query PretaaHealthListFacilities($searchPhrase: String, $skip: Int, $take: Int) {
    pretaaHealthListFacilities(searchName: $searchPhrase, skip: $skip, take: $take) {
      id
      isActive
      name
      startDate
      primaryAdmin {
        email
        id
      }
      _count {
        locations
      }
      createdAt
      timeZone
    }
  }
`;
