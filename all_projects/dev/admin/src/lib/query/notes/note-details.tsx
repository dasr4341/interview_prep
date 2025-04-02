import { gql } from '@apollo/client';

export const noteDetailsQuery = gql`
  query NoteDetails($noteId: String!) {
    pretaaGetNote(noteId: $noteId) {
      id
      eventId
      subject
      text
      company {
        name
        id
        starredByUser {
          userId
        }
      }
      opportunity {
        id
        name
      }
      canModify
    }
  }
`;
