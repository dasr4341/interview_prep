import { gql } from '@apollo/client';

export const eventDetailsMutation = gql`
 mutation HealthEventDetails($eventId: String!) {
  pretaaHealthEventDetails(eventId: $eventId) {
    id
    text
    createdAt
    type
    patientId
    timelineCount
    noteCount
    patientSupporterEventAction
    surveyId
    noReport
    fence {
      longitude
      latitude
      radius
      type
      location
    }
    lastLocation {
      latitude
      longitude
    }
    fenceBreachType
  }
}
`;

export const getPatientHealthData = gql`
 query PatientHealthData($eventId: String!) {
  pretaaHealthRetriveEventRawData(eventId: $eventId)
}
`;