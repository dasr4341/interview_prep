import { gql } from '@apollo/client';

export const getTimelineFilters = gql`
  query TimelineFilter($patientId: String) {
  pretaaHealthEventFilters(patientId: $patientId)
}
`;


