import { gql } from '@apollo/client';

export const createNote = gql`
  mutation CreateNote(
    $text: String!, 
    $subject: String!, 
    $eventId: String, 
    $companyId: String, 
    $delta: JSON!, 
    $opportunityId: String
  ) {
    pretaaNoteCreate(
      text: $text, 
      subject: $subject, 
      eventId: $eventId, 
      companyId: $companyId, 
      delta: $delta,
      opportunityId: $opportunityId
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
      delta
      text
      subject
      createdBy
      createdAt
      canModify
    }
  }
`;
