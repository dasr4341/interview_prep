import { gql } from '@apollo/client';

export const allNotes = gql`
query FilteredNotes($eventId: String, $orderBy: OrderType, $patientId: String, $searchPhrase: String, $skip: Int, $take: Int) {
  pretaaHealthGetFilteredNotes(eventId: $eventId, orderBy: $orderBy, patientId: $patientId, searchPhrase: $searchPhrase, skip: $skip, take: $take) {
    id
    createdBy
    text
    subject
    eventId
    createdAt
    canModify
    patientId
    readAt
    updatedAt
    isUpdated
  }
}`;