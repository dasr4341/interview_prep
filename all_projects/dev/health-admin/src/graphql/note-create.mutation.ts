import { gql } from '@apollo/client';

export const noteCreation = gql`
  mutation NoteCreate(
  $subject: String!
  $text: String!
  $patientId: String
  $eventId: String
) {
  pretaaHealthNoteCreate(
    subject: $subject
    text: $text
    patientId: $patientId
    eventId: $eventId
  ) {
    id
    text
    subject
    createdBy
    updatedAt
    createdAt
    eventId
    readAt
    canModify
  }
}

`;
