import { gql } from '@apollo/client';

export const getNoteQuery = gql`
query GetNote($noteId: String!, $eventId: String) {
  pretaaHealthGetNote(noteId: $noteId, eventId: $eventId) {
    eventId
    canModify
    id
    readAt
    subject
    text
    updatedAt
    createdBy
    createdAt
    creator
    isUpdated
    patientId
  }
}`;