import { gql } from '@apollo/client';

export const eventCardMutation = gql`
  mutation EventCard($eventId: String!) {
    pretaaHealthEventDetails(eventId: $eventId) {
      id
      type
      eventAt
      text
      textDetail
      createdAt
      frequency
      patientSupporterEventAction
      surveyDetails {
        createdAt
      }
    }
  }
`;
