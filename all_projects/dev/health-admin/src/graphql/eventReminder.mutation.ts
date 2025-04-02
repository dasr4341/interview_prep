import { gql } from '@apollo/client';

export const eventReminderMutation = gql`
  mutation EventReminder($eventId: String!, $reminderType: String!) {
    pretaaHealthEventReminder(event_id: $eventId, reminderType: $reminderType)
  }
`;
