import { gql } from '@apollo/client';

export const GetTicketsQuery = gql`
  query GetTickets(
    $daysOpenRange: PretaaDayOpenParams
    $companyIds: [String!]!
    $skip: Int
    $take: Int
    $searchPhrase: String
    $filterRange: PretaaDateRangeParams!
    $filterList: PretaaStatusPriorityPropInput!
    $companyId: String!
  ) {
    pretaaGetCompany(companyId: $companyId) {
      name
    }
    pretaaGetFilteredTickets(
      daysOpenRange: $daysOpenRange
      companyIds: $companyIds
      skip: $skip
      take: $take
      searchPhrase: $searchPhrase
      filterRange: $filterRange
      filterList: $filterList
    ) {
      title
      createdAt
      url
      groupName
      description
      status
      type
      priority
      raisedDate
      ticketUpdatedAt
      companyId
      updatedAt
      id
      ticketId
    }
  }
`;
