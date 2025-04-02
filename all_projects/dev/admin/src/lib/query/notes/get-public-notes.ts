import { gql } from '@apollo/client';

export const GetFilteredNotesQuery = gql`
  query GetFilteredNotes(
    $filterList: [String!]!
    $companyId: String
    $skip: Int
    $take: Int
    $searchPhrase: String
    $eventId: String
  ) {
    pretaaGetFilteredNotes(
      filterList: $filterList
      companyId: $companyId
      skip: $skip
      take: $take
      searchPhrase: $searchPhrase
      eventId: $eventId
    ) {
      id
      eventId
      companyId
      company {
        id
        name
        starredByUser {
          userId
        }
      }
      opportunity {
        name
        id
      }
      text
      subject
      createdBy
      createdAt
      canModify
    }
  }
`;
