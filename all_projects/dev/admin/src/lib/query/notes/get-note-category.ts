import { gql } from '@apollo/client';

export const GetNoteCategoryQuery = gql`
  query GetNoteCategory($noteId: String!) {
    pretaaGetNote(noteId: $noteId) {
      id
      eventId
      companyId
      company {
        id
        name
      }
      events {
        id
        createdAt
        type
        text
        userEvents {
          readAt
          flaggedAt
          hideAt
        }
        launchCount
        noteCount
      }
    }
  }
`;