import { gql } from '@apollo/client';

export const updateNote = gql`
  mutation UpdateNote(
    $text: String!
    $subject: String!
    $eventId: String
    $companyId: String
    $delta: JSON!
    $id: String!
  ) {
    pretaaNoteUpdate(text: $text, subject: $subject, eventId: $eventId, companyId: $companyId, delta: $delta, id: $id) {
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
      delta
      text
      subject
      createdBy
      createdAt
      canModify
    }
  }
`;
