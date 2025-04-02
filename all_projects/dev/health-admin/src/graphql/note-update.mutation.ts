import { gql } from '@apollo/client';

export const noteEdit = gql`
mutation NoteUpdate(
  $pretaaHealthNoteUpdateId: String!
  $subject: String!
  $text: String!
) {
  pretaaHealthNoteUpdate(
    id: $pretaaHealthNoteUpdateId
    subject: $subject
    text: $text
  ) {
    eventId
    id
    parentNoteId
    subject
    text
    deletedAt
  }
}

`;
