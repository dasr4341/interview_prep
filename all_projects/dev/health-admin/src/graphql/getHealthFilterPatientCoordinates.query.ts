import { gql } from '@apollo/client';

export const getHealthFilterPatientCoordinates = gql`
  query GetHealthFilterPatientCoordinates($all: Boolean!, $patients: [String!]!) {
    pretaaHealthFilterPatientCoordinates(all: $all, patients: $patients) {
    longitude
    latitude
    fenceId
    clientTime
    deletedAt
    createdAt
    userId
    updatedAt
    id 
    lastName
    firstName
    lastLocationAddress
  }
  }
`;
