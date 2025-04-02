import { gql } from '@apollo/client';

export const eventPatientListQuery = gql`
 query PretaaHealthEventPatientList(
  $eventId: String!
  $search: String
  $skip: Int
  $take: Int
  $eventFilterType: PatientEventFilterTypes!
) {
  pretaaHealthEventPatientList(
    eventId: $eventId
    search: $search
    skip: $skip
    take: $take
    eventFilterType: $eventFilterType
  ) {
    createdAt
    email

    events {
      autoId
      createdAt
      id
      parentEventId
    }
    firstName
    id
    lastName
    userType
  }
}

`;
