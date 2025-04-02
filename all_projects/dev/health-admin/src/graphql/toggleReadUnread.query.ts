import { gql } from '@apollo/client';

export const toggleReadUnreadQuery = gql`
  query ToggleReadUnread($eventId: String!) {
    pretaaHealthEventReadToggle(eventId: $eventId)
  }
`;
