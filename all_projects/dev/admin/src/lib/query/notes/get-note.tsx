import { gql } from '@apollo/client';

export const getNoteQuery = gql`
  query GetNoteSingle($noteId: String!) {
    pretaaGetNote(noteId: $noteId) {
      id
      text
      delta
      subject
      eventId
      company {
        id
        name
        starredByUser {
          userId
        }
      }
    }
  }
`;
