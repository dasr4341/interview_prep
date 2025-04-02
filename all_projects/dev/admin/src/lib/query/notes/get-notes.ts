import { gql } from '@apollo/client';

export const getNotes = gql`
  query GetNotes($skip: Int, $take: Int, $phrase: String, $companyId: String, $eventId: String) {
    pretaaGetUserNotes(skip: $skip, take: $take, searchPhrase: $phrase, companyId: $companyId, eventId: $eventId) {
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
