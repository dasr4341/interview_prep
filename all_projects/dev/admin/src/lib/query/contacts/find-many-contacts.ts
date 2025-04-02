import { gql } from '@apollo/client';

export const FindManyContactsQuery = gql`
  query FindManyContacts(
    $take: Int, 
    $companyId: String, 
    $searchPhrase: String
  ) {
    pretaaFindManyCompanyContacts(
      take: $take, 
      companyId: $companyId, 
      searchPhrase: $searchPhrase
    ) {
      id
      name
    }
  }
`;