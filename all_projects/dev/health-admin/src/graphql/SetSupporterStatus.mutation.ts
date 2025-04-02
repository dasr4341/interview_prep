import { gql } from '@apollo/client';

export const setSupporterStatusMutation = gql`
  mutation SetSupporterStatus(
    $eventAction: PatientEventActionTypes!
    $eventId: String!
  ) {
    pretaaHealthEventTypeResponse(
      eventAction: $eventAction
      eventId: $eventId
    ) {
      id
      patientSupporterEventAction
    }
  }
`;
